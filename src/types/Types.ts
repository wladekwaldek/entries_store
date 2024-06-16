export type Category = {
  id: string;
  category_name: string;
};

export type Entry = {
  id: string;
  title: string;
  field_names: string[];
  field_contents: string[];
};
