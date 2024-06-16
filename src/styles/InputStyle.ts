import { backgroundColor, border_color, text_color } from "../constants/Colors";

export const InputStyle = {
  // width: width,
  height: 40,
  // marginBottom: marginBottom,
  // marginRight: marginRight,
  border: `1px solid ${border_color}`,
  backgroundColor: backgroundColor,
  borderRadius: 5,
  color: text_color,
  fontSize: 20,
  paddingLeft: 10,
  paddingRight: 10,
  outline: "none",
  boxSizing: "border-box" as "border-box",
};
