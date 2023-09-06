import { getErrorNameFromCode } from 'src/utils/error';
import globalConfig from './global';
import configApi from '../config/api';
import {
    GoogleSignin,
    statusCodes,
} from '@react-native-community/google-signin';
import { LoginManager, AccessToken } from "react-native-fbsdk";
import { sampleSuccess, sampleOTPSuccess, sampleCheckOTPSuccess, sampleChangePasswordSuccess, sampleLoginSuccess } from '../sample';
import { Platform } from 'react-native';
import languages from 'src/locales';
import { DELIVERY_METHODS } from 'src/modules/common/constants';

const getLocation = (url, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = url;

        fetch(baseURL, {
            method: 'GET',
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code))
                } else if (data.msg) {
                    reject(data.msg);
                } else if (data) {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
}

const getAddress = (url, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = url;

        fetch(baseURL, {
            method: 'GET',
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code))
                } else if (data.msg) {
                    reject(data.msg);
                } else if (data.results.length > 0) {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
}

/**
 * Add new Product
 * @param url
 * @param data
 * @returns {Promise<R>}
 */
const addNewProduct = (url, data) => {
    return new Promise((resolve, reject) => {

        let baseURL = configApi.API_ENDPOINT_NUS + url;

        const multiPart = url === '/api/v1/products';
        let formData = new FormData()

        const deliveryMethod = []
        if (data.byHand) {
            deliveryMethod.push('hand')
        }
        if (data.byCourier) {
            deliveryMethod.push('courier')
        }
        if(data.isDonation){
          delete data.price
          delete data.rentalPrice
          delete data.rentDuration
        }
        delete data.byHand
        delete data.byCourier
        data.deliveryMethod = deliveryMethod

        if (multiPart) {
            const keys = Object.keys(data);
            for (let index = 0; index < keys.length; index++) {
                if (keys[index] === 'images') {
                    for (let i = 0; i < data.images.length; i++) {
                        formData.append('photos', {
                            uri: data.images[i].uri,
                            type: data.images[i].type ? data.images[i].type : 'image/jpeg', // or photo.type
                            name: data.images[i].name ? data.images[i].name : ''
                        });
                    }
                } else if (keys[index] === 'deliveryMethod' && data[keys[index]]) {
                    for (let j = 0; j < data.deliveryMethod.length; j++) {
                        formData.append(`deliveryMethod[${j}]`, data.deliveryMethod[j])
                    }
                } else {
                    formData.append(keys[index], data[keys[index]])
                }
            }
        }

        fetch(baseURL, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code))
                } else if (data.msg) {
                    reject(data.msg);
                } else {
                    resolve(data);
                }
            })
            .catch((error) => {
                reject(error);
            });

    });
}

/**
 * Add new Product
 * @param url
 * @param data
 * @returns {Promise<R>}
 */
const addOrderPhotos = (url, data) => {
    return new Promise((resolve, reject) => {

        let baseURL = configApi.API_ENDPOINT_NUS + url;
        let formData = new FormData()

        delete data.orderId

        const keys = Object.keys(data);
        for (let index = 0; index < keys.length; index++) {
            if (keys[index] === 'image') {
                formData.append('photos', {
                    uri: data[keys[index]].uri,
                    type: data[keys[index]].type ? data[keys[index]].type : 'image/jpeg', // or photo.type
                    name: data[keys[index]].name ? data[keys[index]].name : ''
                });
            } else {
                formData.append(keys[index], data[keys[index]])
            }
        }

        console.log('formData: ', formData)

        fetch(baseURL, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code))
                } else if (data.msg) {
                    reject(data.msg);
                } else {
                    resolve(data);
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
}

/**
 * Rating user
 * @param url
 * @param data
 * @returns {Promise<R>}
 */
const ratingUser = (url, data) => {
    return new Promise((resolve, reject) => {

        let baseURL = configApi.API_ENDPOINT_NUS + url;

        fetch(baseURL, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code))
                } else if (data.msg) {
                    reject(data.msg);
                } else {
                    resolve(data);
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
}

/**
 * Update Product
 * @method PUT
 * @param url
 * @param data
 * @returns {Promise<R>}
 */
const updateProduct = (url, data) => {
    return new Promise((resolve, reject) => {

        let baseURL = configApi.API_ENDPOINT_NUS + url;
        delete data.id
        delete data.categoryName
        delete data.durationRent
        delete data.hasImage
        if (data.images && data.images.length > 0) {
            for (let index = 0; index < data.images.length; index++) {
                if (data.images[index].isNew) {
                    delete data.images[index].isNew
                }
            }
        }

        const deliveryMethod = []
        if (data.byHand) {
            deliveryMethod.push('hand')
        }
        if (data.byCourier) {
            deliveryMethod.push('courier')
        }
        delete data.byHand
        delete data.byCourier
        delete data.owner
        delete data.liked
        data.deliveryMethod = deliveryMethod
        if(data.isDonation){
          delete data.price
          delete data.rentalPrice
          delete data.rentDuration
        }
        const multiPart = true;
        let formData = new FormData()

        if (multiPart) {
            const keys = Object.keys(data);
            for (let index = 0; index < keys.length; index++) {
                if (keys[index] === 'images') {
                    for (let i = 0; i < data.images.length; i++) {
                        formData.append('newPhotos', {
                            uri: data.images[i].uri,
                            type: data.images[i].type ? data.images[i].type : 'image/jpeg', // or photo.type
                            name: data.images[i].name ? data.images[i].name : ''
                        });
                    }
                } else if (keys[index] === 'deliveryMethod' && data[keys[index]]) {
                    for (let j = 0; j < data.deliveryMethod.length; j++) {
                        formData.append(`deliveryMethod[${j}]`, data.deliveryMethod[j])
                    }
                } else if (keys[index] === 'photos') {
                    if (data.photos.length > 0) {
                        for (let z = 0; z < data.photos.length; z++) {
                            formData.append(`photos[${z}]`, data.photos[z])
                        }
                    } else {
                        formData.append(`photos`, '')
                    }
                } else {
                    formData.append(keys[index], data[keys[index]])
                }
            }
        }

        fetch(baseURL, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
                'Content-Type': multiPart ? 'multipart/form-data' : 'application/json',
            },
            body: multiPart ? formData : JSON.stringify(data),
        })
            .then((res) => res.json())
            .then(resp => {
                if (resp.code) {
                    reject(getErrorNameFromCode(resp.code, data.language))
                } else if (resp.msg) {
                    reject(resp.msg);
                } else {
                    resolve(resp);
                }
            })
            .catch((error) => {
                reject(getErrorNameFromCode(9998));
            });

    });
}

/**
 * Get all my product
 * @param url
 * @returns {Promise<R>}
 */
const getAllMyProducts = (url, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url;

        fetch(baseURL, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code))
                } else if (data.msg) {
                    reject(data.msg);
                } else {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Order product
 * @param url
 * @returns {Promise<R>}
 */
const orderProduct = (url, data, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url;

        const object = {}
        const keys = Object.keys(data);
        for (let index = 0; index < keys.length; index++) {
            switch (keys[index]) {
                case 'durationTime': {
                    if (data.isRent) {
                        object.durationTime = data[keys[index]]
                    }
                }
                    break;
                case 'pickUpDate': {
                    object.from = new Date(data[keys[index]]).toISOString()
                }
                    break;
                case 'deliveryMethod': {
                    if (data[keys[index]].startsWith('by ') != true) {
                        object.deliveryType = data[keys[index]]
                    } else {
                        object.deliveryType = data[keys[index]].substr(3)
                    }
                }
                    break;
                case 'transaction': {
                    object.transaction = data[keys[index]]
                }
                    break;
                case 'id': {
                    object.productId = data[keys[index]]
                }
                    break;
                case 'deliveryFee': {
                    if (data.deliveryMethod == DELIVERY_METHODS.BY_COURIER) {
                        object.deliveryCost = data[keys[index]]
                    }
                }
                    break;
                case 'buyerAddress': {
                    if (data.deliveryMethod == DELIVERY_METHODS.BY_COURIER) {
                        object.address = data[keys[index]]
                    }
                }
                    break;
                case 'buyerLocation': {
                    if (data.deliveryMethod == DELIVERY_METHODS.BY_COURIER) {
                        object.location = data.buyerLocation[0] + ',' + data.buyerLocation[1]
                    }
                }
                    break;
            }
        }

        fetch(baseURL, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
            body: JSON.stringify(object)
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code))
                } else if (data.msg) {
                    reject(data.msg);
                } else {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Delete product
 * @param url
 * @returns {Promise<R>}
 */
const deleteProduct = (url, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url;

        fetch(baseURL, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code, options.language))
                } else if (data.msg) {
                    reject(data.msg);
                } else {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Delete order photo
 * @param url
 * @returns {Promise<R>}
 */
const deleteOrderPhoto = (url, data, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url;

        delete data.orderId

        fetch(baseURL, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code))
                } else if (data.msg) {
                    reject(data.msg);
                } else {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Delete comment
 * @param url
 * @returns {Promise<R>}
 */
const deleteComment = (url, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url;

        fetch(baseURL, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code))
                } else if (data.msg) {
                    reject(data.msg);
                } else {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Get list product
 * @param url
 * @returns {Promise<R>}
 */
const getListProduct = (url, data, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url;

        fetch(baseURL, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
        })
            .then((res) => res.json())
            .then(resp => {
                if (resp.code) {
                    reject(getErrorNameFromCode(resp.code, data.language))
                } else if (resp.msg) {
                    reject(resp.msg);
                } else {
                    resolve(resp);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Get list designers
 * @param url
 * @returns {Promise<R>}
 */
const getListDesigners = (url, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url;

        fetch(baseURL, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code))
                } else if (data.msg) {
                    reject(data.msg);
                } else {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Get list order photos
 * @param url
 * @returns {Promise<R>}
 */
const getOrderPhotos = (url, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url;

        fetch(baseURL, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code))
                } else if (data.msg) {
                    reject(data.msg);
                } else {
                    if (data.orderPhotos === null) {
                        const empty = {
                            orderPhotos: []
                        }
                        resolve(empty)
                    } else {
                        resolve(data);
                    }
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Get list product
 * @param url
 * @returns {Promise<R>}
 */
const getListSearch = (url, data, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url + '?key=' + data;

        fetch(baseURL, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code))
                } else if (data.msg) {
                    reject(data.msg);
                } else {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Get list Orders
 * @param url
 * @returns {Promise<R>}
 */
const getListOrders = (url, data) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url + '?';

        const newKeys = Object.keys(data);
        for (let index = 0; index < newKeys.length; index++) {
            const lastChar = baseURL.slice(-1) === '?'
            if (lastChar) {
                baseURL = baseURL + newKeys[index] + '=' + data[newKeys[index]]
            } else {
                baseURL = baseURL + '&' + newKeys[index] + '=' + data[newKeys[index]]
            }
        }

        fetch(baseURL, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code))
                } else if (data.msg) {
                    reject(data.msg);
                } else {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Get order detail
 * @param url
 * @returns {Promise<R>}
 */
const getOrderDetail = (url, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url;

        fetch(baseURL, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code))
                } else if (data.msg) {
                    reject(data.msg);
                } else {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Get order detail
 * @param url
 * @returns {Promise<R>}
 */
const cancelOrder = (url, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url;

        fetch(baseURL, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code))
                } else if (data.msg) {
                    reject(data.msg);
                } else {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Update order status
 * @param url
 * @returns {Promise<R>}
 */
const updateStatusOrder = (url, data, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url;

        delete data.orderId

        fetch(baseURL, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
            body: JSON.stringify(data)
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code))
                } else if (data.msg) {
                    reject(data.msg);
                } else {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Complete order
 * @param url
 * @returns {Promise<R>}
 */
const completeOrder = (url, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url;

        fetch(baseURL, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code))
                } else if (data.msg) {
                    reject(data.msg);
                } else {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Like item
 * @param url
 * @returns {Promise<R>}
 */
const likeItem = (url, data, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url;

        fetch(baseURL, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
            body: JSON.stringify({
                "liked": data.liked
            })
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code))
                } else if (data.msg) {
                    reject(data.msg);
                } else {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Bookmark item
 * @param url
 * @returns {Promise<R>}
 */
const bookmarkItem = (url, data, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url;

        fetch(baseURL, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
            body: JSON.stringify({
                "bookmarked": data.bookmarked
            })
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code))
                } else if (data.msg) {
                    reject(data.msg);
                } else {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Bookmark profile
 * @param url
 * @returns {Promise<R>}
 */
const bookmarkProfile = (url, data, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url;

        fetch(baseURL, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
            body: JSON.stringify({
                "bookmarked": data.bookmarked
            })
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code))
                } else if (data.msg) {
                    reject(data.msg);
                } else {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Get product detail
 * @param url
 * @returns {Promise<R>}
 */
const getProductDetail = (url, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url;

        fetch(baseURL, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code))
                } else if (data.msg) {
                    reject(data.msg);
                } else {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Get list filter
 * @param url
 * @returns {Promise<R>}
 */
const getListFilter = (url, data, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url + '?';

        const keys = Object.keys(data);
        const categories = []
        const users = []
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] == 'isClothing' || keys[i] == 'isAccessories' || keys[i] == 'isShoes') {
                if (data[keys[i]]) {
                    categories.push(keys[i].substr(2))
                }
            } else if (keys[i] == 'isMen' || keys[i] == 'isWomen' || keys[i] == 'isKid') {
                if (data[keys[i]]) {
                    users.push(keys[i].substr(2))
                }
            }
        }
        data.categories = categories
        data.users = users
        delete data.isClothing
        delete data.isAccessories
        delete data.isShoes

        delete data.isMen
        delete data.isWomen
        delete data.isKid

        const newKeys = Object.keys(data);

        for (let index = 0; index < newKeys.length; index++) {
            switch (newKeys[index]) {
                case 'isRent':
                case 'isBuyOut':
                case 'isDonation':
                case 'isDesigner': {
                    if (data[newKeys[index]] === true) {
                        const lastChar = baseURL.slice(-1) === '?'
                        if (lastChar) {
                            baseURL = baseURL + newKeys[index] + '=true'
                        } else {
                            baseURL = baseURL + '&' + newKeys[index] + '=true'
                        }
                    }
                }
                    break;
                case 'categories': {
                    for (let i = 0; i < data[newKeys[index]].length; i++) {
                        const lastChar = baseURL.slice(-1) === '?'
                        if (lastChar) {
                            baseURL = baseURL + `categories[${i}]=` + data[newKeys[index]][i]
                        } else {
                            baseURL = baseURL + '&' + `categories[${i}]=` + data[newKeys[index]][i]
                        }
                    }
                }
                    break;
                case 'users': {
                    for (let j = 0; j < data[newKeys[index]].length; j++) {
                        const lastChar = baseURL.slice(-1) === '?'
                        if (lastChar) {
                            baseURL = baseURL + `users[${j}]=` + data[newKeys[index]][j]
                        } else {
                            baseURL = baseURL + '&' + `users[${j}]=` + data[newKeys[index]][j]
                        }
                    }
                }
                    break;
                case 'distanceLimit': {
                    const lastChar = baseURL.slice(-1) === '?'
                    if (lastChar) {
                        baseURL = baseURL + `distanceLimit=` + data[newKeys[index]]
                    } else {
                        baseURL = baseURL + '&' + `distanceLimit=` + data[newKeys[index]]
                    }
                }
                    break;
                case 'location': {
                    const lastChar = baseURL.slice(-1) === '?'
                    if (lastChar) {
                        baseURL = baseURL + `location=` + data[newKeys[index]]
                    } else {
                        baseURL = baseURL + '&' + `location=` + data[newKeys[index]]
                    }
                }
                    break;
                default: break;
            }
        }

        fetch(baseURL, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code))
                } else if (data.msg) {
                    reject(data.msg);
                } else {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Clone product
 * @param url
 * @returns {Promise<R>}
 */
const cloneProduct = (url, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url;

        fetch(baseURL, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code))
                } else if (data.msg) {
                    reject(data.msg);
                } else {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Clone product
 * @param url
 * @returns {Promise<R>}
 */
const checkStripeToken = (url, data, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url;

        fetch(baseURL, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
            body: JSON.stringify(data)
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code))
                } else if (data.msg) {
                    reject(data.msg);
                } else if (data) {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Purchase Order
 * @param url
 * @returns {Promise<R>}
 */
const purchaseOrder = (url, data, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url;

        delete data.orderId

        fetch(baseURL, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
            body: JSON.stringify(data)
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code, 'en', data.msg))
                } else if (data.msg) {
                    reject(data.msg);
                } else if (data) {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Get likes list
 * @param url
 * @returns {Promise<R>}
 */
const getLikesList = (url, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url;

        fetch(baseURL, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code))
                } else if (data.msg) {
                    reject(data.msg);
                } else {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Archive order
 * @param url
 * @returns {Promise<R>}
 */
const archiveOrder = (url, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url;

        fetch(baseURL, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code))
                } else if (data.msg) {
                    reject(data.msg);
                } else {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Get comments
 * @param url
 * @returns {Promise<R>}
 */
const getComments = (url, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url;

        fetch(baseURL, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code))
                } else if (data.msg) {
                    reject(data.msg);
                } else {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Get ratings from sellers
 * @param url
 * @returns {Promise<R>}
 */
const getRatingsFromSellers = (url, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url;

        fetch(baseURL, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code))
                } else if (data.msg) {
                    reject(data.msg);
                } else {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Get ratings from buyers
 * @param url
 * @returns {Promise<R>}
 */
const getRatingsFromBuyers = (url, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url;

        fetch(baseURL, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code))
                } else if (data.msg) {
                    reject(data.msg);
                } else {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Send comment
 * @param url
 * @returns {Promise<R>}
 */
const sendComment = (url, data, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url;

        fetch(baseURL, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
            body: JSON.stringify(data)
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code))
                } else if (data.msg) {
                    reject(data.msg);
                } else {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Purchase extra fee
 * @param url
 * @returns {Promise<R>}
 */
const purchaseExtraFee = (url, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url;

        fetch(baseURL, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code))
                } else if (data.msg) {
                    reject(data.msg);
                } else {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Redeem code
 * @param url
 * @returns {Promise<R>}
 */
const redeemCode = (url, data, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url;

        fetch(baseURL, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
            body: JSON.stringify(data)
        })
            .then((res) => res.json())
            .then(resp => {
                if (resp.code) {
                    reject(getErrorNameFromCode(resp.code, data.language))
                } else if (resp.msg) {
                    reject(resp.msg);
                } else {
                    resolve(resp);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Sign out
 * @param url
 * @returns {Promise<R>}
 */
const signOut = (url, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url;

        const data = {
            deviceToken: globalConfig.getDeviceToken()
        }

        fetch(baseURL, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
            body: JSON.stringify(data)
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code))
                } else if (data.msg) {
                    reject(data.msg);
                } else {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Get method
 * @param url
 * @returns {Promise<R>}
 */
const get = (url, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url;

        const isAuth = (url === '/api/v1/auth/login' || url === '/api/v1/auth/resetPassword/sendCode');

        fetch(baseURL, {
            ...options,
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: !isAuth && globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : undefined,
            },
        })
            .then((res) => res.json())
            .then(data => {
                if (data.msg) {
                    reject(data.msg);
                } else {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Get list points
 * @param url
 * @returns {Promise<R>}
 */
const getListPoints = (url, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url;

        fetch(baseURL, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code))
                } else if (data.msg) {
                    reject(data.msg);
                } else {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Get user info
 * @param url
 * @returns {Promise<R>}
 */
const getUserInfo = (url, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url;

        fetch(baseURL, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code))
                } else if (data.msg) {
                    reject(data.msg);
                } else {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Get google account
 * @param url
 * @returns {Promise<R>}
 */
const getGoogleAccount = () => {
    return new Promise((resolve, reject) => {
        try {
            GoogleSignin.hasPlayServices();
            GoogleSignin.signIn().then(data => {
                resolve(data)
            })
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                reject(getErrorNameFromCode(8000))
            } else if (error.code === statusCodes.IN_PROGRESS) {
                reject(getErrorNameFromCode(8001))
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                reject(getErrorNameFromCode(8002))
            } else {
                reject(getErrorNameFromCode(9998))
            }
        }
    });
};

/**
 * Disconnect Google
 * @param url
 * @returns {Promise<R>}
 */
const disconnectGoogle = () => {
    return new Promise((resolve, reject) => {
        try {
            GoogleSignin.revokeAccess();
            GoogleSignin.signOut().then(data => {
                resolve(true)
            })
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                reject(getErrorNameFromCode(8000))
            } else if (error.code === statusCodes.IN_PROGRESS) {
                reject(getErrorNameFromCode(8001))
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                reject(getErrorNameFromCode(8002))
            } else {
                reject(getErrorNameFromCode(9998))
            }
        }
    });
};

/**
 * Get facebook account
 * @param url
 * @returns {Promise<R>}
 */
const getFacebookAccount = () => {
    const user = {}
    return new Promise((resolve, reject) => {
        try {
            LoginManager.logInWithPermissions(["public_profile"]).then(
                function (result) {
                    if (result.isCancelled) {
                        reject(getErrorNameFromCode(7999))
                    } else {
                        AccessToken.getCurrentAccessToken().then(
                            (data) => {
                                const { accessToken } = data
                                fetch('https://graph.facebook.com/v8.0/me?fields=email,name&access_token=' + accessToken)
                                    .then((response) => response.json())
                                    .then((json) => {
                                        user.name = json.name
                                        user.id = json.id
                                        fetch(`https://graph.facebook.com/${json.id}?fields=picture.width(220).height(220)&redirect=false&access_token=${accessToken}`)
                                            .then((res) => res.json())
                                            .then(data => {
                                                user.avatar = data.picture.data.url
                                                resolve(user)
                                            })
                                            .catch((error) => {
                                                return error;
                                            });
                                    })
                                    .catch(() => {
                                        reject('ERROR GETTING DATA FROM FACEBOOK')
                                    })
                            }
                        )
                    }
                },
                function (error) {
                    reject(error)
                }
            );
        } catch (error) {
            reject(getErrorNameFromCode(9998))
        }
    });
};

/**
 * Update user profile
 * @method PUT
 * @param url
 * @param data
 * @returns {Promise<R>}
 */
const updateUserProfile = (url, data) => {
    return new Promise((resolve, reject) => {

        let baseURL = configApi.API_ENDPOINT_NUS + url;
        let formData = new FormData()
        const language = data.language

        if (data.isChangeEmail) {
            formData.append('email', data.email)
        } else {
            const privateInfos = []
            if (!data.isPublicAddress) {
                privateInfos.push('address')
            }
            if (!data.isPublicEmail) {
                privateInfos.push('email')
            }
            if (!data.isPublicPhone) {
                privateInfos.push('phoneNumber')
            }

            delete data.isPublicAddress
            delete data.isPublicEmail
            delete data.isPublicPhone
            delete data.phoneNumber
            delete data.accountGoogle
            delete data.accountFacebook
            delete data.isChangeEmail
            delete data.isChangeBusiness

            data.privateInfos = privateInfos

            const keys = Object.keys(data);

            for (let index = 0; index < keys.length; index++) {
                if (keys[index] == 'privateInfos') {
                    if (data[keys[index]].length > 0) {
                        for (let j = 0; j < data.privateInfos.length; j++) {
                            formData.append(`privateInfos[${j}]`, data.privateInfos[j])
                        }
                    } else {
                        formData.append(`privateInfos`, '')
                    }
                } else if (keys[index] == 'avatar' && data['socialAvatar'] == '') {
                    if (data['avatar'].uri) {
                        formData.append('avatar', {
                            uri: data['avatar'].uri,
                            type: data['avatar'].type ? data['avatar'].type : 'image/jpeg', // or photo.type
                            name: data['avatar'].name ? data['avatar'].name : ''
                        });
                    } else {
                        formData.append('avatar', '')
                    }
                } else {
                    formData.append(keys[index], data[keys[index]])
                }
            }
        }

        fetch(baseURL, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
            .then((res) => res.json())
            .then(data => {
                if (data.warning) {
                    reject(data.warning)
                } else if (data.code) {
                    reject(getErrorNameFromCode(data.code, language));
                }
                else {
                    resolve(data)
                }
            })
            .catch((error) => {
                return error;
            });
    })
}


/**
* Get Product Of User
* @method GET
* @param url
* @returns {Promise<R>}
*/
const getProductOfUser = (url, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url;

        fetch(baseURL, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code))
                } else if (data.msg) {
                    reject(data.msg);
                } else {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Disconnect Facebook
 * @param url
 * @returns {Promise<R>}
 */
const disconnectFacebook = () => {
    return new Promise((resolve, reject) => {
        try {
            LoginManager.logOut()
            resolve(true)
        } catch (error) {
            reject(error)
        }
    });
}

/**
 * Verify email
 * @param url
 * @returns {Promise<R>}
 */
const verifyEmail = (url, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url;

        fetch(baseURL, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code))
                } else if (data.msg) {
                    reject(data.msg);
                } else {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Get notifications
 * @param url
 * @returns {Promise<R>}
 */
const getNotifications = (url, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url;

        fetch(baseURL, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code))
                } else if (data.msg) {
                    reject(data.msg);
                } else {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Mark as read
 * @param url
 * @returns {Promise<R>}
 */
const markAsRead = (url, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url;

        fetch(baseURL, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code))
                } else if (data.msg) {
                    reject(data.msg);
                } else {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Get unread count
 * @param url
 * @returns {Promise<R>}
 */
const getUnreadCount = (url, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url;

        fetch(baseURL, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code))
                } else if (data.msg) {
                    reject(data.msg);
                } else {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Get bookmarked products
 * @param url
 * @returns {Promise<R>}
 */
const getBookmarkedProducts = (url, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url;

        fetch(baseURL, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code))
                } else if (data.msg) {
                    reject(data.msg);
                } else {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Delete account
 * @param url
 * @returns {Promise<R>}
 */
const deleteAccount = (url, data, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url;

        fetch(baseURL, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
        })
            .then((res) => res.json())
            .then(resp => {
                if (resp.code) {
                    reject(getErrorNameFromCode(resp.code, data.language))
                } else if (resp.msg) {
                    reject(resp.msg);
                } else {
                    resolve(resp);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Get bookmarked profiles
 * @param url
 * @returns {Promise<R>}
 */
const getBookmarkedProfiles = (url, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url;

        fetch(baseURL, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code))
                } else if (data.msg) {
                    reject(data.msg);
                } else {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Update device token
 * @param url
 * @returns {Promise<R>}
 */
const updateDeviceToken = (url, data) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url;

        const obj = {
            deviceToken: data.deviceToken ? data.deviceToken : globalConfig.getDeviceToken(),
            os: Platform.OS
        }

        fetch(baseURL, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
            body: JSON.stringify(obj)
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code))
                } else if (data.msg) {
                    reject(data.msg);
                } else {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Send contact us
 * @param url
 * @returns {Promise<R>}
 */
const sendContact = (url, data) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url;

        fetch(baseURL, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
            body: JSON.stringify(data)
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code, data.language))
                } else if (data.msg) {
                    reject(data.msg);
                } else {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Update setting
 * @param url
 * @returns {Promise<R>}
 */
const updateSetting = (url, data, options = {}) => {
    return new Promise((resolve, reject) => {
        let baseURL = configApi.API_ENDPOINT_NUS + url;

        fetch(baseURL, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: globalConfig.getToken() ? `Bearer ${globalConfig.getToken()}` : null,
            },
            body: JSON.stringify(data)
        })
            .then((res) => res.json())
            .then(data => {
                if (data.code) {
                    reject(getErrorNameFromCode(data.code))
                } else if (data.msg) {
                    reject(data.msg);
                } else {
                    resolve(data);
                }
            })
            .catch((error) => {
                return error;
            });
    });
};

/**
 * Post method
 * @param url
 * @param data
 * @param method
 * @returns {Promise<R>}
 */
const post = async (url, data) => {
    return new Promise((resolve, reject) => {

        let baseURL = configApi.API_ENDPOINT_NUS + url;

        const isAuth = (
            url === '/api/v1/auth/login' ||
            url === '/api/v1/auth/resetPassword/sendCode' ||
            url === '/api/v1/auth/resetPassword/checkCode' ||
            url === '/api/v1/auth/register');

        if (url === '/api/v1/auth/login') {
            data.deviceToken = globalConfig.getDeviceToken()
            data.os = Platform.OS
        }

        fetch(baseURL, {
            method: url !== '/api/v1/auth/resetPassword/updatePassword' ? 'POST' : 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: isAuth ? null : `Bearer ${globalConfig.getToken()}`,
            },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then(resp => {
                if (resp.code) {
                    reject(getErrorNameFromCode(resp.code, data.language))
                } else if (resp.msg) {
                    reject(resp.msg);
                } else {
                    resolve(resp);
                }
            })
            .catch((error) => {
                reject(getErrorNameFromCode(9999, data.language));
            });
    });
}

export default request = {
    get,
    post,
    addNewProduct,
    getLocation,
    getAddress,
    updateProduct,
    getAllMyProducts,
    deleteProduct,
    cloneProduct,
    getListProduct,
    getListSearch,
    getListFilter,
    orderProduct,
    getListOrders,
    getOrderDetail,
    getListDesigners,
    cancelOrder,
    updateStatusOrder,
    addOrderPhotos,
    getOrderPhotos,
    deleteOrderPhoto,
    completeOrder,
    ratingUser,
    archiveOrder,
    likeItem,
    sendComment,
    getComments,
    getProductDetail,
    getLikesList,
    deleteComment,
    checkStripeToken,
    purchaseOrder,
    getRatingsFromSellers,
    getRatingsFromBuyers,
    purchaseExtraFee,
    redeemCode,
    getListPoints,
    getUserInfo,
    getGoogleAccount,
    disconnectGoogle,
    getFacebookAccount,
    disconnectFacebook,
    updateUserProfile,
    getProductOfUser,
    verifyEmail,
    signOut,
    updateDeviceToken,
    getNotifications,
    markAsRead,
    getUnreadCount,
    updateSetting,
    bookmarkItem,
    bookmarkProfile,
    getBookmarkedProducts,
    getBookmarkedProfiles,
    deleteAccount,
    sendContact,
    put: (url, data) => post(url, data, 'PUT'),
};

