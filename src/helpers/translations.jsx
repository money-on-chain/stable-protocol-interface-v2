import { useTranslation } from "react-i18next";

export const useProjectTranslation = () => {
    const ns = "translation";
    const [t, i18n] = useTranslation();

    return { t, i18n, ns };
};
