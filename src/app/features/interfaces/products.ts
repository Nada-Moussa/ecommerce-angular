export interface Products {
    id: string, 
    title: string,
    description: string,
    imageCover: string,
    price: number,
    quanitiy: number,
    ratingsAverage: number
    brand: Brands,
    category: Category,
    subcategory: SubCategory[]
    sold: number
    images: string[]
}

export interface Brands {
    _id: string,
    name: string,
    image: string
}


export interface Category {
    _id: string,
    name: string,
    image: string
}

export interface SubCategory {
    _id: string,
    name: string,
    category: string
}

