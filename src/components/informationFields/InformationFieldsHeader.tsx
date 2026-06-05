import "./InformationFieldsHeader.scss";

interface Props {
  count: number;
  onAdd: () => void;
}

export default function InformationFieldsHeader({ count, onAdd }: Props) {
  return (
    <div className="if-header">
      <div className="if-header__bar">
        <div className="if-header__title">
          <h1>ინფორმაციული ველები</h1>
          {count > 0 && <span className="if-header__count">{count}</span>}
        </div>
        <button className="if-header__add" onClick={onAdd}>
          + ახალი ველი
        </button>
      </div>
      <p className="if-header__subtitle">
        საიტის ინფორმაცია — სოციალური ბმულები, მისამართები, საკონტაქტო
        მონაცემები და სხვა.
      </p>
    </div>
  );
}
