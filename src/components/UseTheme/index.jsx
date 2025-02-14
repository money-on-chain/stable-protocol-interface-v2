import { useEffect, useState } from "react";

const useTheme = () => {

    const [theme, setTheme] = useState(() => {
        // Verificar si el tema está guardado en localStorage
        const defaulTheme = getComputedStyle(document.querySelector(":root"))
            .getPropertyValue("--default-theme")
            .split('"')
            .join("");
        const storedTheme = localStorage.getItem("preferredColorScheme");

        return storedTheme ? storedTheme : defaulTheme;
    });

    useEffect(() => {
        // Aplicar el tema al atributo `data-theme` del elemento `html`
        document.documentElement.setAttribute("data-theme", theme);
        // Guardar la preferencia en localStorage
        localStorage.setItem("preferredColorScheme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    return { theme, toggleTheme };
};

export default useTheme;
