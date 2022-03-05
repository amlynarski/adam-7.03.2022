import { sortAsc, sortDesc, transformInfoData } from "./utils";
import { InfoData } from "../types";

const oldArr: InfoData[] = [
  [100, 2],
  [200, 2],
  [300, 1],
  [400, 6],
  [500, 7],
  [800, 2],
];

const newArr: InfoData[] = [
  [12, 3],
  [150, 22],
  [172, 2],
  [430, 10],
  [900, 2],
];

const newArrWithDuplicates: InfoData[] = [
  [12, 3],
  [150, 22],
  [172, 2],
  [400, 0],
  [430, 10],
  [500, 10],
  [900, 2],
];

describe("transformInfoData", () => {
  it("should return array with total calculated", () => {
    const result = transformInfoData(oldArr);
    const expectedResult = [
      [100, 2, 2],
      [200, 2, 4],
      [300, 1, 5],
      [400, 6, 11],
      [500, 7, 18],
      [800, 2, 20],
    ];
    expect(result).toEqual(expectedResult);
  });

  it("should return merged and sorted array of two arrays", () => {
    const resultAsc = transformInfoData(oldArr, newArr, sortAsc);
    const expectedAsc = [
      [12, 3, 3],
      [100, 2, 5],
      [150, 22, 27],
      [172, 2, 29],
      [200, 2, 31],
      [300, 1, 32],
      [400, 6, 38],
      [430, 10, 48],
      [500, 7, 55],
      [800, 2, 57],
      [900, 2, 59],
    ];
    expect(resultAsc).toEqual(expectedAsc);
    const resultDesc = transformInfoData(oldArr, newArr, sortDesc);
    const expectedDesc = [
      [900, 2, 2],
      [800, 2, 4],
      [500, 7, 11],
      [430, 10, 21],
      [400, 6, 27],
      [300, 1, 28],
      [200, 2, 30],
      [172, 2, 32],
      [150, 22, 54],
      [100, 2, 56],
      [12, 3, 59],
    ];

    expect(resultDesc).toEqual(expectedDesc);
  });

  it("should use new array values if price is duplicated", () => {
    const resultAsc = transformInfoData(oldArr, newArrWithDuplicates, sortAsc);
    const expectedAsc = [
      [12, 3, 3],
      [100, 2, 5],
      [150, 22, 27],
      [172, 2, 29],
      [200, 2, 31],
      [300, 1, 32],
      [430, 10, 42],
      [500, 10, 52],
      [800, 2, 54],
      [900, 2, 56],
    ];
    expect(resultAsc).toEqual(expectedAsc);

    const resultDesc = transformInfoData(
      oldArr,
      newArrWithDuplicates,
      sortDesc
    );
    const expectedDesc = [
      [900, 2, 2],
      [800, 2, 4],
      [500, 10, 14],
      [430, 10, 24],
      [300, 1, 25],
      [200, 2, 27],
      [172, 2, 29],
      [150, 22, 51],
      [100, 2, 53],
      [12, 3, 56],
    ];

    expect(resultDesc).toEqual(expectedDesc);
  });
});
