/// <reference types="react-scripts" />

// Performance and lazy loading types
declare module 'react' {
  interface LazyExoticComponent<T extends ComponentType<any>> {
    $$typeof: symbol;
    _result: T;
    _status: number;
  }
}
