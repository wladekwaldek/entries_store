import {
  backgroundColor,
  dark_main_color,
  main_color,
} from "../constants/Colors";

type Props = {
  text: string;
  func: () => void;
};

export default function CustomButton({ text, func }: Props) {
  return (
    <div
      style={{
        cursor: "pointer",
        backgroundColor: main_color,
        padding: 5,
        borderRadius: 5,
        textAlign: "center",
        border: `1px solid ${dark_main_color}`,
        minWidth: 100,
        height: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: backgroundColor,
        fontFamily: "PlayBold",
      }}
      onClick={func}
      onMouseDown={(e) => e.preventDefault()}
      onTouchStart={(e) => e.preventDefault()}
    >
      {text}
    </div>
  );
}
