#!/usr/bin/env node
/**
 * Enhance Postman Collection v4 with comprehensive tests
 * Run: node enhance_postman_collection.js
 */

const fs = require('fs');
const path = require('path');

// Load the basic collection
const collectionPath = path.join(__dirname, '..', 'TODO_TRACKER_API_v4.postman_collection.json');
const collection = JSON.parse(fs.readFileSync(collectionPath, 'utf8'));

// Add more comprehensive test items
const authFolder = collection.item.find(item => item.name.includes('Auth'));
const todoFolder = collection.item.find(item => item.name.includes('Todos'));

// Add more Auth tests
authFolder.item.push({
    name: 'Register Admin',
    event: [{
        listen: 'prerequest',
        script: {
            exec: ['pm.environment.set("adminEmail", `admin${Date.now()}@test.com`);']
        }
    }, {
        listen: 'test',
        script: {
            exec: [
                'pm.test("✓ Admin registered", () => pm.response.to.have.status(201));',
                'pm.test("✓ Role is admin", () => pm.expect(pm.response.json().data.role).to.eql("admin"));',
                'pm.environment.set("adminId", pm.response.json().data.id);'
            ]
        }
    }],
    request: {
        method: 'POST',
        header: [{ key: 'Content-Type', value: 'application/json' }],
        body: {
            mode: 'raw',
            raw: JSON.stringify({ name: 'Admin User', email: '{{adminEmail}}', password: 'Admin123!', role: 'admin' }, null, 2)
        },
        url: '{{baseUrl}}/api/auth/register'
    }
});

authFolder.item.push({
    name: 'Login Admin',
    event: [{
        listen: 'test',
        script: {
            exec: [
                'pm.test("✓ Admin login success", () => pm.response.to.have.status(200));',
                'pm.test("✓ User is admin", () => pm.expect(pm.response.json().data.user.role).to.eql("admin"));',
                'pm.environment.set("adminToken", pm.response.json().data.token);'
            ]
        }
    }],
    request: {
        method: 'POST',
        header: [{ key: 'Content-Type', value: 'application/json' }],
        body: {
            mode: 'raw',
            raw: '{"email":"{{adminEmail}}","password":"Admin123!"}'
        },
        url: '{{baseUrl}}/api/auth/login'
    }
});

authFolder.item.push({
    name: 'Get My Profile',
    event: [{
        listen: 'test',
        script: {
            exec: [
                'pm.test("✓ Profile retrieved", () => pm.response.to.have.status(200));',
                'pm.test("✓ Email matches", () => pm.expect(pm.response.json().data.email).to.eql(pm.environment.get("userEmail")));'
            ]
        }
    }],
    request: {
        method: 'GET',
        header: [{ key: 'Authorization', value: 'Bearer {{authToken}}' }],
        url: '{{baseUrl}}/api/auth/me'
    }
});

// Add more variables
collection.variable.push(
    { key: 'adminEmail', value: '' },
    { key: 'todoId1', value: '' },
    { key: 'todoId2', value: '' },
    { key: 'todoId3', value: '' }
);

// Add more Todo tests
const newTodoItems = [
    {
        name: 'Create Todo - Medium Priority',
        event: [{
            listen: 'test',
            script: {
                exec: [
                    'pm.test("✓ Todo created", () => pm.response.to.have.status(201));',
                    'pm.environment.set("todoId2", pm.response.json().data._id);'
                ]
            }
        }],
        request: {
            method: 'POST',
            header: [
                { key: 'Content-Type', value: 'application/json' },
                { key: 'Authorization', value: 'Bearer {{authToken}}' }
            ],
            body: {
                mode: 'raw',
                raw: JSON.stringify({ title: 'Réviser JWT', priority: 'medium' }, null, 2)
            },
            url: '{{baseUrl}}/api/todos'
        }
    },
    {
        name: 'Create Todo - Low Priority',
        event: [{
            listen: 'test',
            script: {
                exec: [
                    'pm.test("✓ Todo created", () => pm.response.to.have.status(201));',
                    'pm.environment.set("todoId3", pm.response.json().data._id);'
                ]
            }
        }],
        request: {
            method: 'POST',
            header: [
                { key: 'Content-Type', value: 'application/json' },
                { key: 'Authorization', value: 'Bearer {{authToken}}' }
            ],
            body: {
                mode: 'raw',
                raw: JSON.stringify({ title: 'Faire les courses', priority: 'low', dueDate: '2025-11-10' }, null, 2)
            },
            url: '{{baseUrl}}/api/todos'
        }
    },
    {
        name: 'Get Todo by ID',
        event: [{
            listen: 'test',
            script: {
                exec: [
                    'pm.test("✓ Todo retrieved", () => pm.response.to.have.status(200));',
                    'pm.test("✓ Correct ID", () => pm.expect(pm.response.json().data._id).to.eql(pm.environment.get("todoId")));'
                ]
            }
        }],
        request: {
            method: 'GET',
            header: [{ key: 'Authorization', value: 'Bearer {{authToken}}' }],
            url: '{{baseUrl}}/api/todos/{{todoId}}'
        }
    },
    {
        name: 'Get Todos - Filter by Status (Active)',
        event: [{
            listen: 'test',
            script: {
                exec: [
                    'pm.test("✓ Filtered todos", () => pm.response.to.have.status(200));',
                    'pm.test("✓ All active", () => {',
                    '    pm.response.json().data.forEach(todo => pm.expect(todo.completed).to.be.false);',
                    '});'
                ]
            }
        }],
        request: {
            method: 'GET',
            header: [{ key: 'Authorization', value: 'Bearer {{authToken}}' }],
            url: {
                raw: '{{baseUrl}}/api/todos?status=active',
                host: ['{{baseUrl}}'],
                path: ['api', 'todos'],
                query: [{ key: 'status', value: 'active' }]
            }
        }
    },
    {
        name: 'Get Todos - Filter by Priority',
        event: [{
            listen: 'test',
            script: {
                exec: [
                    'pm.test("✓ Priority filter works", () => {',
                    '    pm.response.json().data.forEach(todo => pm.expect(todo.priority).to.eql("high"));',
                    '});'
                ]
            }
        }],
        request: {
            method: 'GET',
            header: [{ key: 'Authorization', value: 'Bearer {{authToken}}' }],
            url: {
                raw: '{{baseUrl}}/api/todos?priority=high',
                host: ['{{baseUrl}}'],
                path: ['api', 'todos'],
                query: [{ key: 'priority', value: 'high' }]
            }
        }
    },
    {
        name: 'Get Todos - Search by Title',
        event: [{
            listen: 'test',
            script: {
                exec: [
                    'pm.test("✓ Search works", () => {',
                    '    pm.response.json().data.forEach(todo => pm.expect(todo.title.toLowerCase()).to.include("mongo"));',
                    '});'
                ]
            }
        }],
        request: {
            method: 'GET',
            header: [{ key: 'Authorization', value: 'Bearer {{authToken}}' }],
            url: {
                raw: '{{baseUrl}}/api/todos?q=MongoDB',
                host: ['{{baseUrl}}'],
                path: ['api', 'todos'],
                query: [{ key: 'q', value: 'MongoDB' }]
            }
        }
    },
    {
        name: 'Toggle Todo Status',
        event: [{
            listen: 'test',
            script: {
                exec: [
                    'pm.test("✓ Todo toggled", () => pm.response.to.have.status(200));'
                ]
            }
        }],
        request: {
            method: 'PATCH',
            header: [{ key: 'Authorization', value: 'Bearer {{authToken}}' }],
            url: '{{baseUrl}}/api/todos/{{todoId2}}/toggle'
        }
    }
];

// Insert new items before Delete (keep Delete last)
const deleteIndex = todoFolder.item.findIndex(item => item.name === 'Delete Todo');
todoFolder.item.splice(deleteIndex, 0, ...newTodoItems);

// Rename first Create Todo
todoFolder.item[0].name = 'Create Todo - High Priority';
todoFolder.item[0].event[0].script.exec[1] = 'pm.environment.set("todoId1", pm.response.json().data._id);';

// Add Authorization Tests folder
const authTestFolder = {
    name: '🔒 Authorization Tests',
    item: [
        {
            name: 'Access Without Token (SHOULD FAIL)',
            event: [{
                listen: 'test',
                script: {
                    exec: [
                        'pm.test("✓ Status code is 401", () => pm.response.to.have.status(401));',
                        'pm.test("✓ Error message", () => pm.expect(pm.response.json().status).to.eql("error"));'
                    ]
                }
            }],
            request: {
                method: 'GET',
                header: [],
                url: '{{baseUrl}}/api/todos'
            }
        },
        {
            name: 'Access With Invalid Token (SHOULD FAIL)',
            event: [{
                listen: 'test',
                script: {
                    exec: [
                        'pm.test("✓ Status code is 401", () => pm.response.to.have.status(401));'
                    ]
                }
            }],
            request: {
                method: 'GET',
                header: [{ key: 'Authorization', value: 'Bearer invalid-token-xyz' }],
                url: '{{baseUrl}}/api/todos'
            }
        },
        {
            name: 'Admin Can See All Todos',
            event: [{
                listen: 'test',
                script: {
                    exec: [
                        'pm.test("✓ Admin access granted", () => pm.response.to.have.status(200));',
                        'pm.test("✓ Todos returned", () => pm.expect(pm.response.json().data).to.be.an("array"));'
                    ]
                }
            }],
            request: {
                method: 'GET',
                header: [{ key: 'Authorization', value: 'Bearer {{adminToken}}' }],
                url: '{{baseUrl}}/api/todos'
            }
        }
    ]
};

// Add Validation Tests folder
const validationFolder = {
    name: '🧪 Validation Tests',
    item: [
        {
            name: 'Create Todo Without Title (SHOULD FAIL)',
            event: [{
                listen: 'test',
                script: {
                    exec: [
                        'pm.test("✓ Status code is 400", () => pm.response.to.have.status(400));',
                        'pm.test("✓ Validation error", () => pm.expect(pm.response.json().status).to.eql("error"));'
                    ]
                }
            }],
            request: {
                method: 'POST',
                header: [
                    { key: 'Content-Type', value: 'application/json' },
                    { key: 'Authorization', value: 'Bearer {{authToken}}' }
                ],
                body: {
                    mode: 'raw',
                    raw: '{"priority":"high"}'
                },
                url: '{{baseUrl}}/api/todos'
            }
        },
        {
            name: 'Create Todo With Invalid Priority (SHOULD FAIL)',
            event: [{
                listen: 'test',
                script: {
                    exec: [
                        'pm.test("✓ Status code is 400", () => pm.response.to.have.status(400));'
                    ]
                }
            }],
            request: {
                method: 'POST',
                header: [
                    { key: 'Content-Type', value: 'application/json' },
                    { key: 'Authorization', value: 'Bearer {{authToken}}' }
                ],
                body: {
                    mode: 'raw',
                    raw: '{"title":"Test","priority":"urgent"}'
                },
                url: '{{baseUrl}}/api/todos'
            }
        },
        {
            name: 'Login With Wrong Password (SHOULD FAIL)',
            event: [{
                listen: 'test',
                script: {
                    exec: [
                        'pm.test("✓ Status code is 401", () => pm.response.to.have.status(401));',
                        'pm.test("✓ Error message", () => pm.expect(pm.response.json().message).to.exist);'
                    ]
                }
            }],
            request: {
                method: 'POST',
                header: [{ key: 'Content-Type', value: 'application/json' }],
                body: {
                    mode: 'raw',
                    raw: '{"email":"{{userEmail}}","password":"WrongPassword!"}'
                },
                url: '{{baseUrl}}/api/auth/login'
            }
        }
    ]
};

// Add new folders
collection.item.push(authTestFolder, validationFolder);

// Update collection info
collection.info.description = 'Automated test suite for TODO Tracker API. Covers authentication, CRUD operations, authorization, filtering, and validation.';
collection.info.version = '4.0.0';

// Save enhanced collection
fs.writeFileSync(collectionPath, JSON.stringify(collection, null, 2));

console.log('Collection enhanced successfully.');
console.log('Total test requests:', countRequests(collection));
console.log('Test folders:', collection.item.length);
console.log('Run tests: ./run-api-tests.sh');

function countRequests(collection) {
    let count = 0;
    collection.item.forEach(folder => {
        count += folder.item.length;
    });
    return count;
}
