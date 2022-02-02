class Product {
    constructor() {
        this.externalId = "";
        this.name = "";
        this.description = "";
        this.unit = "";
        this.images = [];
        this.mainCategory = "";
        this.mainSubcategories = [];
        this.secondaryCategories = [];
        this.secondarySubcategories = [];
        this.price = "";
        this.decimals = "";
        this.formattedPrice = "";
        this.currency = "";
    }


    getExternalId() {
        return this.externalId;
    }

    getName() {
        return this.name;
    }

    getDescription() {
        return this.description;
    }

    getUnit() {
        return this.unit;
    }

    getImages() {
        return this.images;
    }

    getMainCategory() {
        return this.mainCategory;
    }

    getMainSubcategories() {
        return this.mainSubcategories;
    }

    getSecondaryCategories() {
        return this.secondaryCategories;
    }

    getSecondarySubcategories() {
        return this.secondarySubcategories;
    }

    getPrice() {
        return this.price;
    }

    getDecimals() {
        return this.decimals;
    }

    getFormattedPrice() {
        return this.formattedPrice;
    }

    getCurrency() {
        return this.currency;
    }


    setExternalId(id) {
        this.externalId = id;
        return this;
    }

    setName(name) {
        this.name = name;
        return this;
    }

    setDescription(description) {
        this.description = description;
        return this;
    }

    setUnit(unit) {
        this.unit = unit;
        return this;
    }

    addImage(img) {
        return this.images.push(img);
    }

    setMainCategory(name) {
        this.mainCategory = name;
    }

    addMainSubcategories(subcategories) {
        subcategories = subcategories.split(/\,|\//);
        subcategories.forEach(subcategory => {
            this.mainSubcategories.push(subcategory.trim());
        });
    }

    addSecondaryCategory(categories) {
        categories = categories.split(/\,|\//);
        categories.forEach(category => {
            this.secondaryCategories.push(category.trim());
        });
    }

    addSecondarySubcategory(subcategories) {
        subcategories = subcategories.split(/\,|\//);
        subcategories.forEach(subcategory => {
            this.secondarySubcategories.push(subcategory.trim());
        });
    }

    setPrice(price) {
        this.price = price;
        return this;
    }

    setDecimals(decimals) {
        this.decimals = decimals;
        return this;
    }

    setFormattedPrice() {
        this.formattedPrice = `${this.price},${this.decimals}`;
        return this;
    }

    setCurrency(currency) {
        this.currency = currency;
        return this;
    }
}

module.exports = Product;