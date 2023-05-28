//#region ----Data layer----
const TYPE_FOOD_GROCERY = "food-grocery";
const TYPE_PERSONAL_CARE = "personal-care";
const TYPE_MAKE_UP_ITEMS = "make-up-items";

class Product {
    constructor(id, name, type, img, price) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.img = img
        this.price = price;
    }
}

const products = [
    new Product(1, "Rupchanda Fortified Soyabean Oil", TYPE_FOOD_GROCERY, "./assets/rupchandaoilob.jpg", 950),
    new Product(2, "Beef Regular Bone In", TYPE_FOOD_GROCERY, "./assets/beefmeat.jpg", 740),
    new Product(3, "Diploma Instant Full Cream Milk", TYPE_FOOD_GROCERY, "./assets/diploma.jpg", 415),
    new Product(4, "Fresh Super Premium Salt", TYPE_FOOD_GROCERY, "./assets/freshsalt.jpg", 38),
    new Product(5, "Fortune Basmati Rice", TYPE_FOOD_GROCERY, "./assets/fortune-basmati-rice.jpg", 300),
    new Product(6, "Nescafe instant coffee jar classic", TYPE_FOOD_GROCERY, "./assets/nescafe-coffee.jpg", 550),


    new Product(7, "Dettol Hand Wash Fresh Pump", TYPE_PERSONAL_CARE, './assets/dettol-handwash.jpg', 102),
    new Product(8, "Dettol Soap Original", TYPE_PERSONAL_CARE, './assets/dettolsoap.jpg', 80),
    new Product(9, "Gillete Mach 3 Man's Razor", TYPE_PERSONAL_CARE, './assets/gillete-mach3.jpg', 375),
    new Product(10, "Parachute Cocunut Oil", TYPE_PERSONAL_CARE, './assets/parachutteoil.jpg', 140),
    new Product(11, "Parachute Hair Oil Anti Hairfall Oil Extra Care", TYPE_PERSONAL_CARE, './assets/parachute-hair-oil.jpg', 290),

    new Product(12, "Amore Matte Lip Creme, Shade Devotion 14", TYPE_MAKE_UP_ITEMS, './assets/amore-lipstick.jpg', 750),
    new Product(13, "Makeup Revolution Reloaded Eyeshadow", TYPE_MAKE_UP_ITEMS, './assets/eyeshadow.jpg', 540),
    new Product(14, "Revolution Hydrating Primer", TYPE_MAKE_UP_ITEMS, './assets/primer.jpg', 570),
    new Product(15, "Revolution Loose Baking Powder, Banana Deep", TYPE_MAKE_UP_ITEMS, './assets/banana-deep.jpg', 507)
]

class CartEntry {
    constructor(product, quantity) {
        this.product = product;
        this.quantity = quantity;
    }

    get price() {
        return this.product.price * this.quantity;
    }
}

function clearUserInformation() {
    sessionStorage.removeItem('userInfo');
    sessionStorage.removeItem('userInfo-name');
    sessionStorage.removeItem('userInfo-email');
    clearSelectedItem();
}

function storeUserInformation() {
    sessionStorage.setItem('userInfo', '05ad6ca2-5576-4915-913d-1ce833cbe6fb');
    sessionStorage.setItem('userInfo-name', 'Admin');
    sessionStorage.setItem('userInfo-email', 'admin@admin.com');
}

function getUserInformation() {
    let id = sessionStorage.getItem('userInfo')
    let name = sessionStorage.getItem('userInfo-name') ?? "Undefined"
    let email = sessionStorage.getItem('userInfo-email') ?? "Undefined-email"
    if (id == undefined) {
        return undefined;
    } else {
        return { "id": id, "name": name, "email": email };
    }
}

function clearSelectedItem() {
    sessionStorage.removeItem('product-id');
}

function getSelectedItem() {
    let id = sessionStorage.getItem('product-id')
    if (id != null) {
        return parseInt(id)
    }
    return null;
}

function putSelectedItem(id) {
    sessionStorage.setItem('product-id', '' + id)
}

function isReadyForLogin(email, password) {
    if (email == "admin@admin.com" && password == "123456") {
        storeUserInformation();

        return true;
    }
    return false;

}

let cart = []
function getsubtotal() {
    let price = 0;
    cart.forEach((entry) => {
        price += entry.price;
    })
    return price;
}

const ACTION_ADD = "add"
const ACTION_DEL = "del"
const ACTION_SET = "set"


function findProductInCart(item) {
    for (index in cart) {
        if (cart[index].product.id == item.id) {
            return cart[index];
        }
    }

    return null;
}

function addOrRemoveItem(item, quantity, actionType) {
    let entryIndex = -1;
    let entry;
    for (index in cart) {
        if (cart[index].product.id == item.id) {
            entry = cart[index];
            entryIndex = index;
            break
        }
    }

    var isNew = false;
    if (entry == undefined) {
        entry = new CartEntry(item, 0);
        entryIndex = 0;
        isNew = true;
    }
    if (actionType == ACTION_SET) {
        entry.quantity = quantity;
        if (quantity == 0) {
            cart.splice(entryIndex, 1)
            return null;
        } else {
            cart[entryIndex] = entry;
            return cart[entryIndex];
        }

    } else if (actionType == ACTION_ADD) {
        entry.quantity += 1;
        if (isNew) {
            cart.push(entry);
        } else {
            cart[entryIndex] = entry;
        }

        return entry;
    } else {
        let newQuantity = entry.quantity - 1;
        if (newQuantity > 0) {
            entry.quantity = newQuantity;
            cart[entryIndex] = entry;
            return cart[entryIndex];
        } else {
            cart.splice(entryIndex, 1);
            return null;
        }

    }

}

//#endregion