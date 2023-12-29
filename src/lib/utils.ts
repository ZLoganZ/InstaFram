import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isToday, isThisWeek, isThisYear } from "date-fns";
import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { autoGravity, focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";
import {
  quality,
  format as formatCld,
} from "@cloudinary/url-gen/actions/delivery";
import { auto as qualityAuto } from "@cloudinary/url-gen/qualifiers/quality";
import { auto } from "@cloudinary/url-gen/qualifiers/format";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getDateTimeToNow = (date: string | number | Date) => {
  if (!date) {
    return "";
  }

  const today = new Date();
  const commentDate = new Date(date);
  const diff = Math.abs(today.getTime() - commentDate.getTime());
  const diffDays = Math.ceil(diff / (1000 * 3600 * 24));

  if (diffDays === 1) {
    const diffHours = Math.ceil(diff / (1000 * 3600));
    if (diffHours === 1) {
      const diffMinutes = Math.ceil(diff / (1000 * 60));
      return `${
        diffMinutes - 1 === 0
          ? "Just now"
          : `${diffMinutes - 1} minute${diffMinutes - 1 === 1 ? "" : "s"} ago`
      }`;
    }
    return `${diffHours - 1} hour${diffHours - 1 === 1 ? "" : "s"} ago`;
  }

  if (diffDays <= 7) {
    return `${diffDays - 1} day${diffDays - 1 === 1 ? "" : "s"} ago`;
  }

  if (diffDays <= 365) {
    return format(commentDate, "MMM dd • h:mm a");
  }

  return format(commentDate, "MMM dd, yyyy");
};

export const getDateTime = (date: string | number | Date) => {
  if (!date) {
    return "";
  }
  const commentDate = new Date(date);

  if (isToday(commentDate)) {
    return format(commentDate, "h:mm a");
  }

  if (isThisWeek(commentDate, { weekStartsOn: 1 })) {
    return format(commentDate, "EEEE • h:mm a");
  }

  if (isThisYear(commentDate)) {
    return format(commentDate, "MMM dd • h:mm a");
  }

  return format(commentDate, "MMM dd, yyyy • h:mm a");
};

export const getLastOnline = (date: string | number | Date) => {
  if (!date) {
    return "";
  }

  const today = new Date();
  const commentDate = new Date(date);
  const diff = Math.abs(today.getTime() - commentDate.getTime());
  const diffDays = Math.ceil(diff / (1000 * 3600 * 24));

  if (diffDays === 1) {
    const diffHours = Math.ceil(diff / (1000 * 3600));
    const diffMinutes = Math.ceil(diff / (1000 * 60));
    if (diffHours === 1 || diffMinutes < 60) {
      return `Online ${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
    }
    return `Online ${diffHours - 1} hour${diffHours - 1 === 1 ? "" : "s"} ago`;
  }

  if (diffDays <= 7) {
    return `Online ${diffDays - 1} day${diffDays - 1 === 1 ? "" : "s"} ago`;
  }

  if (diffDays <= 365) {
    return "Last seen at " + format(commentDate, "MMM dd • h:mm a");
  }

  return "Last seen at " + format(commentDate, "MMM dd, yyyy");
};

export const getDateMonth = (date: string | number | Date) => {
  if (!date) {
    return "";
  }
  const commentDate = new Date(date);

  if (isToday(commentDate)) {
    return format(commentDate, "h:mm a");
  }

  if (isThisWeek(commentDate, { weekStartsOn: 1 })) {
    return format(commentDate, "EEEE");
  }

  if (isThisYear(commentDate)) {
    return format(commentDate, "MMM dd");
  }

  return format(commentDate, "MMM dd, yyyy");
};

export const capitalizeFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseFormData = (data: Record<string, any>) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });
  return formData;
};

type ImageOptions =
  | "avatar"
  | "post"
  | "miniAvatar"
  | "story"
  | "storyAvatar"
  | "default";

export const getImageURL = (
  image?: string,
  option: ImageOptions = "default",
) => {
  if (!image) return;

  if (image.includes("http")) return image;

  const cld = new Cloudinary({
    cloud: { cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string },
  });

  const myImage = cld.image(image);

  switch (option) {
    case "avatar":
      myImage
        .resize(fill().height(150).width(150).gravity(focusOn(FocusOn.faces())))
        .delivery(quality(qualityAuto()))
        .delivery(formatCld(auto()));
      break;
    case "post":
      myImage
        .resize(fill().height(600).gravity(autoGravity()))
        .delivery(quality(qualityAuto()))
        .delivery(formatCld(auto()));
      break;
    case "miniAvatar":
      myImage
        .resize(fill().height(50).width(50).gravity(focusOn(FocusOn.faces())))
        .delivery(quality(qualityAuto()))
        .delivery(formatCld(auto()));
      break;
    case "story":
      myImage
        .resize(fill().height(300).gravity(autoGravity()))
        .delivery(quality(qualityAuto()))
        .delivery(formatCld(auto()));
      break;
    case "storyAvatar":
      myImage
        .resize(fill().height(80).width(80).gravity(focusOn(FocusOn.faces())))
        .delivery(quality(qualityAuto()))
        .delivery(formatCld(auto()));
      break;
    default:
      break;
  }

  return myImage.toURL();
};
