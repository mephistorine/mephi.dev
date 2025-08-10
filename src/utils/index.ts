import {isToday, isYesterday} from "date-fns";

export * from "./plugins.ts"

export const formatHumanDate = (date: Date): string => {
    if (isToday(date)) {
        return "Сегодня";
    }

    if (isYesterday(date)) {
        return "Вчера";
    }

    return date.toLocaleDateString("ru", {dateStyle: "medium"});
};

export const pathBuilder = {
    home: () => "/",
    singleArticle: (slug: string) => `/articles/${slug}`,
    singleCategory: (slug: string) => `/categories/${slug}`,
    singleTag: (slug: string) => `/tags/${slug}`,
}
