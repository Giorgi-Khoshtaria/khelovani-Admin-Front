import type { NamespaceItem } from "@/types/translation.types";
import "./NamespaceSidebar.scss";

interface NamespaceSidebarProps {
  namespaces: NamespaceItem[];
  activeNamespace: string;
  setActiveNamespace: (value: string) => void;
}

export default function NamespaceSidebar({
  namespaces,
  activeNamespace,
  setActiveNamespace,
}: NamespaceSidebarProps) {
  return (
    <div className="namespaces-sidebar">
      <h3>კატეგორიები</h3>
      <ul>
        <li
          className={activeNamespace === "all" ? "active" : ""}
          onClick={() => setActiveNamespace("all")}
        >
          ყველა
        </li>
        {namespaces.map((ns) => (
          <li
            key={ns._id}
            className={activeNamespace === ns._id ? "active" : ""}
            onClick={() => setActiveNamespace(ns._id)}
          >
            {ns.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
