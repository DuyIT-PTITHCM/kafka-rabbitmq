const fakeDatabase = {
    '1': { id: '1', name: 'John', email: 'john@example.com' },
    '2': { id: '2', name: 'Alice', email: 'alice@example.com' },
};

const root = {
    hello: () => 'Xin chào, GraphQL!',
    getUser: ({ id }) => fakeDatabase[id],
    getUsers: () => Object.values(fakeDatabase),
    createUser: ({ input }) => {
        const id = require('crypto').randomBytes(10).toString('hex');
        fakeDatabase[id] = input;
        return { id, ...input };
    },
    updateUser: ({ id, input }) => {
        if (!fakeDatabase[id]) {
            throw new Error(`User with ID ${id} not found`);
        }
        fakeDatabase[id] = { ...fakeDatabase[id], ...input };
        return { id, ...fakeDatabase[id] };
    },
    deleteUser: ({ id }) => {
        if (!fakeDatabase[id]) {
            throw new Error(`User with ID ${id} not found`);
        }
        const deletedUser = fakeDatabase[id];
        delete fakeDatabase[id];
        return deletedUser;
    },
};

module.exports = root;