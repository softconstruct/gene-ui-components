import { faker } from '@faker-js/faker';

/**
 * Example how to generate the test data
 * you can discover more functionality by
 * following the link https://github.com/faker-js/faker#readme
 */

export const countries = new Array(10)
    .fill({})
    .map((country, countryIndex) => ({
        label: faker.address.country(),
        isChecked: false,
        isPermanent: false,
        positionIndex: countryIndex,
        childrenList: new Array(5).fill({}).map((city, cityIndex) => ({
            label: faker.address.city(),
            isChecked: false,
            isPermanent: false,
            positionIndex: cityIndex,
            tooltipProps: {
                title: faker.lorem.word(3),
                text: faker.lorem.paragraph()
            },
            childrenList: new Array(4).fill({}).map((building, buildingIndex) => ({
                label: faker.address.buildingNumber(),
                isChecked: false,
                isPermanent: false,
                positionIndex: buildingIndex,
                childrenList: new Array(3).fill({}).map((direction, directionIndex) => ({
                    label: faker.address.direction(),
                    isChecked: false,
                    isPermanent: false,
                    tooltipProps: {
                        title: faker.lorem.word(3),
                        text: faker.lorem.paragraph()
                    },
                    positionIndex: directionIndex,
                    childrenList: new Array(2).fill({}).map((cityName, cityNameIndex) => ({
                        label: faker.address.cityName(),
                        isChecked: false,
                        isPermanent: false,
                        positionIndex: cityNameIndex
                    }))
                }))
            }))
        }))
    }))
    .sort((a, b) => a?.label[0] > b?.label[0]);
export const countriesNotNested = new Array(10)
    .fill({})
    .map((country, countryIndex) => ({
        label: faker.address.country(),
        isChecked: false,
        isPermanent: false,
        positionIndex: countryIndex
    }))
    .sort((a, b) => a?.label[0] > b?.label[0]);
