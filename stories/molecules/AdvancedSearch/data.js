import { faker } from '@faker-js/faker';

export const typeFilterData = [
    {
        name: 'Segment',
        value: 'segment',
        icon: 'bc-icon-segment',
        checked: false,
        id: 1
    },
    {
        name: 'Template',
        value: 'template',
        icon: 'bc-icon-template',
        checked: false,
        id: 2
    },
    {
        name: 'Campaign',
        value: 'campaign',
        icon: 'bc-icon-campaign',
        checked: false,
        id: 3
    },
    {
        name: 'Customer Journey',
        value: 'customer-journey',
        icon: 'bc-icon-customer-journey',
        checked: false,
        id: 4
    },
    {
        name: 'Reports',
        value: 'reports',
        icon: 'bc-icon-reports',
        checked: false,
        id: 5
    }
];

const names = Array.from({ length: 10 }, () => faker.name.fullName());
export const userFilterData = Array.from({ length: names.length }, (e, n) => ({
    name: names[n],
    value: names[n],
    checked: false,
    id: crypto.randomUUID()
}));

const types = ['segment', 'template', 'campaign', 'customer-journey', 'reports'];

export const data = Array.from({ length: 100 }, () => {
    const fakeType = types[Math.floor(Math.random() * types.length)];
    const icon = `bc-icon-${fakeType}`;
    const fakeId = `${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(
        Math.random() * 10
    )}${Math.floor(Math.random() * 10)}`;
    const fakeTitle = faker.lorem.sentence().slice(0, Math.random() * 10 + 5);
    const fakeFullName = names[Math.floor(Math.random() * names.length)];
    const fakeDate = faker.date.past().toLocaleDateString();

    return {
        icon,
        id: fakeId,
        title: fakeTitle,
        type: fakeType,
        name: fakeFullName,
        date: {
            labelText: 'Updated:',
            date: fakeDate
        }
    };
});
