export default class ServiceStore {
  store = {};

  create = (Service) => {
    this.store[Service] = new Service();
    return this.store[Service];
  };

  get = (Service) => {
    if (this.store[Service]) {
      return this.store[Service];
    } else return this.create(Service);
  };

  destroy = (Service) => {
    if (this.store[Service]) {
      delete this.store[Service];
    }
  };
}

export const instance = new ServiceStore();
