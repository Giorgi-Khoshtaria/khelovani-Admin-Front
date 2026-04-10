import React from "react";
import { Link } from "react-router-dom";
import useExport from "@/hooks/export/useExport";
import "./ExportPage.scss";

const ExportPage: React.FC = () => {
  const { loading, actions } = useExport();

  const cards = [
    {
      id: "translations",
      title: "თარგმანები",
      description: "სისტემის ყველა თარგმანი ყველა ნეიმსფეისიდან",
      icon: "🌐",
      action: actions.handleExportTranslations,
      isLoading: loading.translations,
      managePath: "/translations",
    },
    {
      id: "roles",
      title: "როლები",
      description: "სისტემაში რეგისტრირებული ყველა როლი და მათი აღწერილობები",
      icon: "🛡️",
      action: actions.handleExportRoles,
      isLoading: loading.roles,
      managePath: "/roles",
    },
    {
      id: "permissions",
      title: "პერმიშენები",
      description: "ხელმისაწვდომი ყველა პერმიშენის სია და კატეგორიები",
      icon: "🔑",
      action: actions.handleExportPermissions,
      isLoading: loading.permissions,
      managePath: "/roles", // Permissions are usually managed in Roles
    },
    {
      id: "menu",
      title: "მენიუ",
      description: "ნავიგაციის ელემენტები, ლინკები და მათი რიგითობა",
      icon: "📋",
      action: actions.handleExportMenu,
      isLoading: loading.menu,
      managePath: "/menu",
    },
  ];

  return (
    <div className="export-page">
      <header className="export-page__header">
        <h1>მონაცემების ექსპორტი</h1>
        <p>ჩამოტვირთეთ სისტემის მონაცემები Excel ფორმატში</p>
      </header>

      <div className="export-page__grid">
        {cards.map((card) => (
          <section key={card.id} className="export-card">
            <div className="export-card__top">
              <div className="export-card__icon">{card.icon}</div>
              <Link to={card.managePath} className="export-card__manage-link" title="მართვა">
                ⚙️ მართვა
              </Link>
            </div>
            <div className="export-card__content">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
            <button 
              className={`export-card__button export-${card.id}-btn`}
              onClick={card.action}
              disabled={card.isLoading}
            >
              {card.isLoading ? "მუშაობს..." : "ექსპორტი (.xlsx)"}
            </button>
          </section>
        ))}
      </div>
    </div>
  );
};

export default ExportPage;
