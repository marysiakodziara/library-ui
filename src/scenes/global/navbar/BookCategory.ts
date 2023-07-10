export default interface BookCategory {
    name: string;
    id: number;
    subcategories: BookCategory[];
}

export const categories: BookCategory[] = [
    {
        name: "Art & Photography",
        id: 1,
        subcategories: []
    },
    {
        name: "Biography",
        id: 2,
        subcategories: []
    },
    {
        name: "Business, Finance & Law",
        id: 3,
        subcategories: []
    },
    {
        name: "Young Adult",
        id: 4,
        subcategories: []
    },
    {
        name: "Children's Books",
        id: 5,
        subcategories: []
    },
    {
        name: "Computing",
        id: 6,
        subcategories: []
    },
    {
        name: "Crafts & Hobbies",
        id: 7,
        subcategories: []
    },
    {
        name: "Crime & Thriller",
        id: 8,
        subcategories: []
    },
    {
        name: "Dictionaries & Languages",
        id: 9,
        subcategories: []
    },
    {
        name: "Entertainment",
        id: 10,
        subcategories: []
    },
    {
        name: "Fiction",
        id: 11,
        subcategories: []
    },
    {
        name: "Culinary",
        id: 12,
        subcategories: []
    },
    {
        name: "Graphic Novels, Anime & Manga",
        id: 13,
        subcategories: []
    },
    {
        name: "Health",
        id: 14,
        subcategories: []
    },
    {
        name: "History & Archaeology",
        id: 15,
        subcategories: []
    },
    {
        name: "Home & Garden",
        id: 16,
        subcategories: []
    },
    {
        name: "Humour",
        id: 17,
        subcategories: []
    },
    {
        name: "Medical",
        id: 18,
        subcategories: []
    },
    {
        name: "Mind, Body & Spirit",
        id: 19,
        subcategories: []
    },
    {
        name: "Natural History",
        id: 20,
        subcategories: []
    },
    {
        name: "Personal Development",
        id: 21,
        subcategories: []
    },
    {
        name: "Poetry & Drama",
        id: 22,
        subcategories: []
    },
    {
        name: "Reference",
        id: 23,
        subcategories: []
    },
    {
        name: "Religion",
        id: 24,
        subcategories: []
    },
    {
        name: "Romance",
        id: 25,
        subcategories: []
    },
    {
        name: "Science & Geography",
        id: 26,
        subcategories: []
    },
    {
        name: "Science Fiction, Fantasy & Horror",
        id: 27,
        subcategories: []
    },
    {
        name: "Society & Social Sciences",
        id: 28,
        subcategories: []
    },
    {
        name: "Sport",
        id: 29,
        subcategories: []
    },
    {
        name: "Teaching Resources & Education",
        id: 30,
        subcategories: []
    },
    {
        name: "Technology & Engineering",
        id: 31,
        subcategories: []
    },
    {
        name: "Transport",
        id: 32,
        subcategories: []
    }];

export const mainCategories: BookCategory[] = [
    {
        name: "Art, Crafts & Photography",
        id: 1,
        subcategories: [categories[0], categories[6]]
    },
    {
        name: "Biography & Memoirs",
        id: 2,
        subcategories: [categories[1]]
    },
    {
        name: "Business, Finance & Law",
        id: 3,
        subcategories: [categories[2]]
    },
    {
        name: "Children & Young Adult",
        id: 4,
        subcategories: [categories[3], categories[4]]
    },
    {
        name: "Computing, Science & Technology",
        id: 5,
        subcategories: [categories[5], categories[25], categories[30]]
    },
    {
        name: "Culinary, Food & drink",
        id: 6,
        subcategories: [categories[11]]
    },
    {
        name: "Health, Mind & Body",
        id: 7,
        subcategories: [categories[13], categories[18]]
    },
    {
        name: "History, Religion & Social Sciences",
        id: 8,
        subcategories: [categories[14], categories[23], categories[27]]
    },
    {
        name: "Humour, Entertainment & Fiction",
        id: 9,
        subcategories: [categories[9], categories[10], categories[16]]
    },
    {
        name: "Reference, Languages & Education",
        id: 10,
        subcategories: [categories[8], categories[22], categories[29]]
    }
];