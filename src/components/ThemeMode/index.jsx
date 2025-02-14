import React, { Fragment } from "react";
import { useProjectTranslation } from "../../helpers/translations";
import useTheme from "../UseTheme";

export default function ThemeMode() {
    const {t} = useProjectTranslation();
    const { theme, toggleTheme } = useTheme();

    return (
        <>
            <div className="lightModeContainer">
                <div className="lightModeSwitch">
                    <input
                        type="checkbox"
                        id="color-scheme-selector"
                        className="color-scheme-selector"
                        checked={theme === "dark"}
                        onChange={toggleTheme}
                    ></input>
                    <label htmlFor="color-scheme-selector"></label>
                </div>
                <div id="SchemeText" className="lightModeText">
                    {t("settings.themeMode." + theme)}
                </div>
            </div>
        </>
    );
}
