import type { StatTopProduct } from "@/types/statistics.types";
import { formatCurrency, formatNumber } from "@/utils/formatStats";
import "./TopProducts.scss";

interface Props {
  products: StatTopProduct[];
}

/** Best-selling products ranked by units sold. */
export default function TopProducts({ products }: Props) {
  return (
    <div className="top-products">
      <div className="top-products__head">
        <h3>ყველაზე გაყიდვადი პროდუქტები</h3>
      </div>

      {products.length === 0 ? (
        <div className="top-products__empty">მონაცემები არ არის</div>
      ) : (
        <ol className="top-products__list">
          {products.map((p, i) => (
            <li key={p.productId} className="top-products__item">
              <span className="top-products__rank">{i + 1}</span>
              <img
                className="top-products__img"
                src={p.image}
                alt={p.titleGe}
                loading="lazy"
              />
              <div className="top-products__info">
                <span className="top-products__title" title={p.titleGe}>
                  {p.titleGe}
                </span>
                <span className="top-products__revenue">
                  {formatCurrency(p.revenue)}
                </span>
              </div>
              <span className="top-products__units">
                {formatNumber(p.unitsSold)} ც.
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
