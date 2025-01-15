import { GetServerSideProps } from "next";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface ApiCountry {
  name_ru: string;
  flag_url: string;
  iso_code2: string;
}

interface Country {
  name: string;
  flag: string;
  code: string;
}

interface HomePageProps {
  initialCountries: Country[];
}

const HomePage = ({ initialCountries }: HomePageProps) => {
  const [countries, setCountries] = useState(initialCountries);

  const handleRemove = (code: string) => {
    setCountries((prev) => prev.filter((country) => country.code !== code));
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Список стран</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <AnimatePresence>
          {countries.map((country) => (
            <motion.li
              key={country.code}
              initial={{ opacity: 1, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 200 }}
              layout
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "10px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <Image
                  src={country.flag}
                  alt={`Флаг ${country.name}`}
                  width={30}
                  height={20}
                  style={{ borderRadius: "2px" }}
                />
                <span>{country.name}</span>
              </div>
              <button
                onClick={() => handleRemove(country.code)}
                style={{
                  padding: "5px 10px",
                  border: "none",
                  borderRadius: "5px",
                  backgroundColor: "#ff6b6b",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Удалить
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const response = await fetch(
    "https://gist.githubusercontent.com/sanchezzzhak/8606e9607396fb5f8216/raw/39de29950198a7332652e1e8224f988b2e94b166/ISO3166_RU.json"
  );
  const countries: ApiCountry[] = await response.json();

  const formattedCountries: Country[] = countries
    .map((country) => ({
      name: country.name_ru,
      flag: country.flag_url ? `https:${country.flag_url}` : "",
      code: country.iso_code2,
    }))
    .filter((country) => country.name && country.flag && country.code);

  return {
    props: {
      initialCountries: formattedCountries,
    },
  };
};

export default HomePage;
