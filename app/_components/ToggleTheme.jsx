'use client';

import { useTheme } from "next-themes";
import React, { useState, useEffect } from "react";
import LightIcon from "./icons/LightIcon";
import DarkIcon from "./icons/DarkIcon";
import SystemIcon from "./icons/SystemIcon";

export function ToggleTheme({ className }) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isTooltipVisible, setTooltipVisible] = useState(false);

    const toggleTheme = () => {
        if (theme === "light") {
            setTheme("dark");
        } else if (theme === "dark") {
            setTheme("system");
        } else {
            setTheme("light");
        }
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    const renderIcon = () => {
        switch (theme) {
            case 'light':
                return <LightIcon className="fill-black dark:fill-white" />;
            case 'dark':
                return <DarkIcon className="fill-black dark:fill-white" />;
            case 'system':
            default:
                return <SystemIcon className="fill-black dark:fill-white" />;
        }
    };

    if (!mounted) {
        return (
            <button
                className={`${className}`}>
                <SystemIcon className="fill-black dark:fill-white" />
            </button>
        );
    }


    return (
        <>
            <button
                className={`${className}`}
                onClick={toggleTheme}
                onMouseEnter={() => setTooltipVisible(true)}
                onMouseLeave={() => setTooltipVisible(false)}
                onFocus={() => setTooltipVisible(true)}
                onBlur={() => setTooltipVisible(false)}
            >
                {renderIcon()}
                {isTooltipVisible && (
                    <div className="absolute top-full mt-2 px-2 py-1 bg-gray-700 text-white text-xs rounded shadow-lg">
                        {theme.charAt(0).toUpperCase() + theme.substring(1)}
                    </div>
                )}
            </button>
        </>
    );
}
