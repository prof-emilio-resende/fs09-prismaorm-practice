import { PrismaClient, User, Vehicle } from "@prisma/client";

const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"]
});

async function createUser(user: Omit<User, "id">) {
    console.log("Criando novo usuario ...");
    const created = await prisma.user.create({
        data: user
    });

    console.log(`usuario já criado ${created.id}`);
    return created;
}

async function createVehicle(vehicle: Omit<Vehicle, "id">) {
    console.log("criand veiculo...");
    const created = await prisma.vehicle.create({
        data: vehicle
    });

    console.log(`veiculo criado ${created.id}`);
}

async function getUsers() {
    console.log("Buscando todos os usuários...");
    return await prisma.user.findMany();
}

async function getUsersWithVehicles() {
    console.log("Buscando todos os usuários com veículos...");
    return await prisma.user.findMany({
        include: {
            fleet: true
        }
    })
}

async function removeUsers(users: Array<User>) {
    console.log("Removendo os usuários...");
    users.forEach(async (u) => {
        console.log(`removendo user ${u.id}`);
        await prisma.user.delete({
            where: {
                id: u.id
            }
        })
    })
}

async function main () {
    const u = await createUser({firstName: "Emilio", lastName: "Resende"});
    const users = await getUsers();
    console.log(users);
    console.log("criando veiculos");

    const v = await createVehicle({description: "Hyundai Tucson", year: 2022, userId: u.id});
    const users2 = await getUsers();
    console.log(users2);
    const usersWithVehicles = await getUsersWithVehicles();
    console.log(usersWithVehicles);
    
    removeUsers(users);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        await prisma.$disconnect();
        console.log(e);
        process.exit(1);
    });