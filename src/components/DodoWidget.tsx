// components/DodoWidget.tsx
import { useEffect } from "react";

declare global {
    interface Window {
        DodoWidget?: any;
    }
}

export default function DodoWidget() {
    useEffect(() => {
        const loadDodoWidget = async () => {
            // Avoid loading multiple times
            if (!document.querySelector("#dodo-css")) {
                const css = document.createElement("link");
                css.id = "dodo-css";
                css.rel = "stylesheet";
                css.href = "https://widget.usedodo.com/dodo-widget.css";
                document.head.appendChild(css);
            }

            if (!document.querySelector("#dodo-script")) {
                const script = document.createElement("script");
                script.id = "dodo-script";
                script.src = "https://widget.usedodo.com/dodo-widget.iife.js";
                script.async = true;
                script.onload = () => {
                    if (window.DodoWidget) {
                        window.DodoWidget.init({
                            title: "Dodo",
                            widgetKey: "JLqPop8c/dQhbseMbMF+DPZJS4qyBMPfBOP7bxweWqE=",
                            widgetTheme: "theme-dark-blue",
                            AiName: "Dodo Assistant",
                        });
                    }
                };
                document.body.appendChild(script);
            } else if (window.DodoWidget) {
                window.DodoWidget.init({
                    title: "Dodo",
                    widgetKey: "JLqPop8c/dQhbseMbMF+DPZJS4qyBMPfBOP7bxweWqE=",
                    widgetTheme: "theme-dark-blue",
                    AiName: "Dodo Assistant",
                });
            }
        };

        loadDodoWidget();
    }, []);

    return null; // The widget renders externally
}