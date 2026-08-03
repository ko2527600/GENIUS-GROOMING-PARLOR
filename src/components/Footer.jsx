import { shop } from "../data/shopData";

export default function Footer() {
  return (
    <footer className="bg-ink px-4 py-8 text-center text-sm text-gray-400">
      <p className="font-semibold text-white">{shop.name}</p>
      <p className="mt-1">{shop.address}</p>
      <p className="mt-4">
        &copy; {new Date().getFullYear()} {shop.name}. All rights reserved.
      </p>
    </footer>
  );
}
