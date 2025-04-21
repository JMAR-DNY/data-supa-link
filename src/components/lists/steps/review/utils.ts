
export const getColorScheme = (theme: string) => {
  const colors = {
    dark: {
      container: "bg-[#181D29] border border-[#23293D]",
      tableHead: "bg-[#23293D] text-white",
      rowEven: "bg-[#181D29]",
      rowOdd: "bg-[#23293D]",
      cell: "text-white"
    },
    light: {
      container: "bg-white border border-gray-200",
      tableHead: "bg-gray-100 text-gray-800",
      rowEven: "bg-white",
      rowOdd: "bg-gray-50",
      cell: "text-gray-900"
    }
  };
  
  return theme === "dark" ? colors.dark : colors.light;
};
