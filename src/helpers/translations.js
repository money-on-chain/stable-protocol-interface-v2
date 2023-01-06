import { useTranslation } from "react-i18next";
import { config } from "../projects/config";

export const useProjectTranslation = () => {

    const ns = 'translation';
    const [t, i18n]= useTranslation();

    return [t, i18n, ns]

};