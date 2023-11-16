import { faker } from '@faker-js/faker';

export const emails = [];

export function createEmails() {
    return {
        label: faker.internet.email()
    };
}

Array.from({ length: 5 }).forEach(() => {
    emails.push(createEmails());
});

export default emails;
