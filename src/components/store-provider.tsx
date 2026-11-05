"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { CartEntry, Product } from "@/lib/types";
import {
  CART_KEY,
  MAX_QUANTITY,
  money,
  parseCart,
  resolveCart,
  validQuantity,
} from "@/lib/cart";
import { Icon } from "./icon";

type Store = {
  entries: CartEntry[];
  ready: boolean;
  add: (product: Product, quantity: number) => void;
  setQuantity: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  remember: (products: Product[]) => void;
  products: Product[];
  catalogError: boolean;
  notify: (message: string) => void;
};

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({
  children,
  catalog,
  catalogError,
}: {
  children: React.ReactNode;
  catalog: Product[];
  catalogError: boolean;
}) {
  const [entries, setEntries] = useState<CartEntry[]>([]);
  const [products, setProducts] = useState<Product[]>(catalog);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState<{ text: string; id: number } | null>(
    null,
  );
  const entriesRef = useRef<CartEntry[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const restore = () => {
      let restored: CartEntry[] = [];
      try {
        restored = parseCart(localStorage.getItem(CART_KEY));
      } catch {
        /* Storage may be unavailable. */
      }
      if (!catalogError)
        restored = resolveCart(restored, catalog).map(({ id, quantity }) => ({
          id,
          quantity,
        }));
      setProducts(catalog);
      entriesRef.current = restored;
      setEntries(restored);
      setReady(true);
    };
    restore();
    const sync = (event: StorageEvent) => {
      if (event.key === CART_KEY || event.key === null) restore();
    };
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("storage", sync);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [catalog, catalogError]);

  const notify = useCallback((text: string) => {
    setNotice({ text, id: Date.now() });
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setNotice(null), 5000);
  }, []);

  const save = useCallback((next: CartEntry[]) => {
    entriesRef.current = next;
    setEntries(next);
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(next));
    } catch {
      /* Keep the cart usable in memory. */
    }
  }, []);

  const remember = useCallback(
    (next: Product[]) => {
      setProducts(next);
      // Reconcile stored items against the current catalog, including retired products.
      save(
        resolveCart(entriesRef.current, next).map(({ id, quantity }) => ({
          id,
          quantity,
        })),
      );
    },
    [save],
  );

  const add = (product: Product, quantity: number) => {
    if (!ready || !product.active || !validQuantity(quantity)) return;
    const current = entriesRef.current;
    const existing = current.find((entry) => entry.id === product.id);
    if ((existing?.quantity || 0) + quantity > MAX_QUANTITY) {
      notify(`You can add up to ${MAX_QUANTITY} of this item.`);
      return;
    }
    const next = existing
      ? current.map((entry) =>
          entry.id === product.id
            ? { ...entry, quantity: entry.quantity + quantity }
            : entry,
        )
      : [...current, { id: product.id, quantity }];
    save(next);
    notify(
      `${product.title} × ${quantity} added to cart — ${money(product.pricePkr * quantity)}.`,
    );
  };

  return (
    <StoreContext.Provider
      value={{
        entries,
        products,
        ready,
        add,
        remember,
        notify,
        catalogError,
        setQuantity: (id, quantity) => {
          if (validQuantity(quantity))
            save(
              entriesRef.current.map((entry) =>
                entry.id === id ? { ...entry, quantity } : entry,
              ),
            );
        },
        remove: (id) =>
          save(entriesRef.current.filter((entry) => entry.id !== id)),
      }}
    >
      {children}
      <div
        className="toast-region"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {notice && (
          <div className="toast" key={notice.id}>
            <Icon name="check" />
            <span>{notice.text}</span>
            <button
              type="button"
              className="icon-button"
              aria-label="Dismiss notification"
              onClick={() => setNotice(null)}
            >
              <Icon name="close" />
            </button>
          </div>
        )}
      </div>
    </StoreContext.Provider>
  );
}

export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("Store components must be inside StoreProvider.");
  return store;
}

export function CatalogSync({ products }: { products: Product[] }) {
  const { remember, ready } = useStore();
  useEffect(() => {
    if (ready) remember(products);
  }, [remember, products, ready]);
  return null;
}
