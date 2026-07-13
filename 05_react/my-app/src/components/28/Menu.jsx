// Menu.jsx
const items = ['Home', 'About', 'Services', 'Contact']

const Menu = () => (
  <nav className="bg-white border-b border-gray-200 shadow-sm">
    <ul className="flex justify-center gap-8 px-6 py-3 text-sm font-medium text-gray-600">
      {items.map((item) => (
        <li
          key={item}
          className="cursor-pointer transition-colors hover:text-purple-600"
        >
          {item}
        </li>
      ))}
    </ul>
  </nav>
)
export default Menu
