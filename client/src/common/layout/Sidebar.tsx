type SidebarProps = {
  activeItem: string;
  onSelectItem: (item: string) => void;
  onLogout: () => Promise<void>;
  isLoggingOut: boolean;
};

const navGroups = [
  {
    title: "Main",
    items: ["Dashboard", "Subscriptions"],
  },
  {
    title: "Organize",
    items: ["Calendar"],
  },
];

function Sidebar({
  activeItem,
  onSelectItem,
  onLogout,
  isLoggingOut,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand-block">
        <div className="brand-pulse" aria-hidden="true" />
        <div>
          <p className="brand-kicker">Subscription Manager</p>
          <h1 className="brand-title">Control Center</h1>
        </div>
      </div>

      {navGroups.map((group) => (
        <section key={group.title} className="nav-group">
          <p className="nav-group-title">{group.title}</p>
          <ul>
            {group.items.map((item) => (
              <li key={item}>
                <button
                  type="button"
                  className={
                    activeItem === item ? "nav-item active" : "nav-item"
                  }
                  onClick={() => onSelectItem(item)}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <div className="sidebar-footer">
        <p>Plan</p>
        <strong>Pro Trial</strong>
        <button
          type="button"
          className="logout-button"
          onClick={() => {
            void onLogout();
          }}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
