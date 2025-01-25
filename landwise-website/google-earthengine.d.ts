declare module '@google/earthengine' {
  export = ee;
}

declare namespace ee {
  namespace data {
    function authenticateViaPrivateKey(
      privateKey: Record<string, any>,
      success: () => void,
      failure: (error: any) => void
    ): void;

    function setDeadline(milliseconds: number): void;
  }

  function initialize(
    clientId?: string | null,
    clientSecret?: string | null,
    successCallback?: () => void,
    failureCallback?: (error: any) => void
  ): void;
    
  interface DateConstructor {
    (date: string | Number): Date;
    new (date: string | Number): Date;
  }

  type DateType = InstanceType<typeof Date>;
    
  const Date: DateConstructor;

  class Date {
    format(formatStr: string): string;
  }

  interface ImageCollectionConstructor {
    (id: string): ImageCollection;
    new (id: string): ImageCollection;
    fromImages(images: Image[]): ImageCollection;
  }

  const ImageCollection: ImageCollectionConstructor;

  class ImageCollection {
    filterDate(start: Date, end: Date): ImageCollection;
    select(bands: string[]): ImageCollection;
    toBands(): ImageCollection;
    reduceRegion( reducer: Reducer, geometry: Geometry, scale: number ): any;
  }

  interface ImageConstructor {
    (id: string[] | string | number): Image;
    new (id: string[]): Image;
    pixelArea(): Image; 
  }

  const Image: ImageConstructor;

  type ImageType = InstanceType<typeof Image>;

  class Image {
    addBands(image: Image): Image;
    reduceRegion( reducer: Reducer, geometry: Geometry, scale: number ): any;
    clip(geometry: Geometry): Image;
    select(bands: string): Image;
    normalizedDifference(bands: [string, string]): Image;
    static pixelArea(): Image;
    updateMask(mask: Image): Image;
    evaluate(callback: (result: any, error: any) => void): void;
  }

  class Reducer {
    static first(): any;
    static toList(): any;
    static frequencyHistogram(): any;
  }

  class Geometry {
    constructor();
    centroid(): Geometry;
    bounds(): Geometry;
    static Polygon(points: number[][]): Geometry;
    getInfo(): Promise<any>;
  }

  class Polygon extends Geometry {
    constructor(points: number[][]);
  }

  interface ListConstructor {
    (items: any[]): List;
  }

  const List: ListConstructor;
    
  class List {
    get(index: number): any;
    length(): number;
    map(callback: (item: any, index: number) => any): List;
  }

  class Array {
    get(index: number): any;
    length(): number;
    slice(start: number, end?: number): Array;
  }

  class Feature {
    geometry(): Geometry;
    get(property: string): any;
  }

  class FeatureCollection {
    filterBounds(geometry: Geometry): FeatureCollection;
    map(callback: (feature: Feature) => any): FeatureCollection;
  }

  interface DictionaryConstructor {
    (items: any): Dictionary;
    new (items: any): Dictionary; 
  }

  const Dictionary: DictionaryConstructor;
    
  class Dictionary {
    get(key: string): any;
    keys(): List;
    values(): List;
    evaluate(callback: (result: any, error: any) => void): void;
  }

  interface NumberConstructor {
    (value: number): Number;
    new (value: number): Number;
  }

  const Number: NumberConstructor;

  class Number {
    format(format: any): any;
  }
}
