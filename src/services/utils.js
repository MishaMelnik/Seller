import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '../config';

function getAuthHeader() {
  return AsyncStorage.getItem('token').then(token =>
    token ? {Authorization: `JWT ${token}`, 'Content-Language': 'uk'} : {},
  );
}

export class BadRequestError {
  constructor(message = 'Bad Request') {
    this.message = message;
  }
}

export class UnauthorizedError {
  constructor(message = 'Unauthorized') {
    this.message = message;
  }
}

export class ForbiddenError {
  constructor(message = 'Forbidden') {
    this.message = message;
  }
}

export class InternalServerError {
  constructor(message = 'Internal Server Error') {
    this.message = message;
  }
}

export class BaseError {
  constructor(message = 'Error') {
    this.message = message;
  }
}

const ERRORS = {
  400: BadRequestError,
  401: UnauthorizedError,
  403: ForbiddenError,
  500: InternalServerError,
};

function throwError(status, message) {
  if (status in ERRORS) {
    throw new ERRORS[status](message);
  } else {
    throw new BaseError(message);
  }
}

export function fetchList(path, id = '') {
  if (path.hasOwnProperty('list')) {
    path = path.list;
  }
  if (id !== '') {
    path = path.replace('{id}', id);
  }
  let fullUrl = `${API_URL}/${path}/`;

  return getAuthHeader()
    .then(headers => fetch(fullUrl, {headers: headers}))
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        if (response.status in ERRORS) {
          throw new ERRORS[response.status]();
        } else {
          throw new BaseError();
        }
      }
    });
}

export function loadMore(self, targetName, url_next, options = {}) {
  let origin_list = self.state[targetName];
  fetchListWithOutsideUrl(url_next)
    .then(response => {
      if (options.hasOwnProperty('checked')) {
        response.results = response.results.map(item => ({
          ...item,
          checked: options.checked,
        }));
      }

      origin_list = origin_list.concat(response.results);
      self.setState({
        [targetName]: origin_list,
        next: response.next,
      });
    })
    .catch(error => console.warn('error', error));
}

export function fetchListWithOutsideUrl(url) {
  return getAuthHeader()
    .then(headers => fetch(url, {headers: headers}))
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return {status: response.status, response: response.json()};
      }
    });
}

export function fetchListWithGetParams(path, getParams) {
  if (path.hasOwnProperty('list')) {
    path = path.list;
  }

  let fullUrl = `${API_URL}/${path}/`;

  if (getParams) {
    fullUrl = fullUrl + getParams;
  }

  return getAuthHeader()
    .then(headers => fetch(fullUrl, {headers: headers}))
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        if (response.status in ERRORS) {
          throw new ERRORS[response.status]();
        } else {
          throw new BaseError();
        }
      }
    });
}

export function fetchDetails(path, id) {
  if (path.hasOwnProperty('details')) {
    path = path.details;
    path = path.replace('{id}', id);
  }

  let fullUrl = `${API_URL}/${path}/`;

  return getAuthHeader()
    .then(headers => fetch(fullUrl, {headers: headers}))
    .then(response => response.json())
    .catch(error => {
      console.error(error);
    });
}

export function createObject(path, obj, options = {}) {
  if (path.hasOwnProperty('create')) {
    path = path.create;
  }
  let fullUrl = `${API_URL}/${path}/`;
  return getAuthHeader()
    .then(headers => {
      headers.Accept = 'application/json';
      headers['Content-Type'] = 'application/json';

      return fetch(fullUrl, {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: headers,
      });
    })
    .then(response => {
      if (response.ok) {
        return true;
      } else {
        return response.json().then(responseJSON => {
          throwError(response.status, responseJSON);
        });
      }
    });
}

export function createObjectWithResponse(path, obj) {
  if (path.hasOwnProperty('create')) {
    path = path.create;
  }
  let fullUrl = `${API_URL}/${path}/`;
  return getAuthHeader()
    .then(headers => {
      headers.Accept = 'application/json';
      headers['Content-Type'] = 'application/json';

      return fetch(fullUrl, {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: headers,
      });
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then(JSON => {
          if (!response.ok) {
            throwError(response.status, JSON);
          }
        });
      }
    });
}

export function createSale(path, obj) {
  if (path.hasOwnProperty('create')) {
    path = path.create;
  }
  let fullUrl = `${API_URL}/${path}/`;

  return getAuthHeader()
    .then(headers => {
      headers.Accept = 'application/json';
      headers['Content-Type'] = 'application/json';

      return fetch(fullUrl, {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: headers,
      });
    })
    .then(response => {
      if (response.ok) {
        return true;
      } else {
        return response.json();
      }
    });
}

export function deleteObject(path, id) {
  if (path.hasOwnProperty('delete')) {
    path = path.delete;
    path = path.replace('{id}', id);
  }

  let fullUrl = `${API_URL}/${path}/`;

  return getAuthHeader()
    .then(headers =>
      fetch(fullUrl, {
        method: 'delete',
        headers: headers,
      }),
    )
    .then(response => {
      if (response.ok) {
        return {};
      } else if (response.status in ERRORS) {
        throw new ERRORS[response.status]();
      } else {
        throw new BaseError();
      }
    });
}

export function updateObject(path, data, id = null) {
  if (path.hasOwnProperty('update')) {
    path = path.update;
    if (id) {
      path = path.replace('{id}', id);
    }
  }

  let fullUrl = `${API_URL}/${path}/`;

  return getAuthHeader()
    .then(headers => {
      headers['Content-Type'] = 'application/json';
      return fetch(fullUrl, {
        method: 'put',
        headers: headers,
        body: JSON.stringify(data),
      });
    })
    .then(response => {
      if (response.ok) {
        return true;
      } else {
        return response.json().then(JSON => {
          if (!response.ok) {
            throwError(response.status, JSON);
          }
        });
      }
    });
}

export function updateObjectPATCH(path, data, id = null) {
  if (path.hasOwnProperty('update')) {
    path = path.update;
    if (id) {
      path = path.replace('{id}', id);
    }
  }

  let fullUrl = `${API_URL}/${path}/`;

  return getAuthHeader()
    .then(headers => {
      headers['Content-Type'] = 'application/json';
      return fetch(fullUrl, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify(data),
      });
    })
    .then(response => {
      if (response.ok) {
        return true;
      } else {
        return response.json().then(JSON => {
          if (!response.ok) {
            throwError(response.status, JSON);
          }
        });
      }
    });
}

export function updateObjectWithResponse(path, data, id = null) {
  if (path.hasOwnProperty('update')) {
    path = path.update;
    if (id) {
      path = path.replace('{id}', id);
    }
  }

  let fullUrl = `${API_URL}/${path}/`;

  return getAuthHeader()
    .then(headers => {
      headers['Content-Type'] = 'application/json';
      return fetch(fullUrl, {
        method: 'put',
        headers: headers,
        body: JSON.stringify(data),
      });
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then(JSON => {
          if (!response.ok) {
            throwError(response.status, JSON);
          }
        });
      }
    });
}

export function CheckCodeConsumer(path, obj) {
  if (path.hasOwnProperty('request')) {
    path = path.request;
  }

  let fullUrl = `${API_URL}/${path}/`;

  return getAuthHeader()
    .then(headers => {
      headers.Accept = 'application/json';
      headers['Content-Type'] = 'application/json';

      return fetch(fullUrl, {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: headers,
      });
    })
    .then(response => {
      return response.json();
    });
}

export function setRoutePurchasesList(obj) {
  return AsyncStorage.setItem('route', JSON.stringify(obj)).then(() => true);
}

export function getRoutePurchasesList() {
  return AsyncStorage.getItem('route')
    .then(json => JSON.parse(json))
    .then(route => {
      if (route) {
        return route;
      } else {
        throw new UnauthorizedError();
      }
    });
}
