import CompanyRouter from "../components/company/company.router.js";
import EmployeeRouter from "../components/employee/employee.router.js";
import AuthRouter from "../components/Auth/auth.route.js";

export const initRoutes = (app) => {

    app.use("/companies", CompanyRouter);
    app.use("/employees", EmployeeRouter);
    app.use("/",AuthRouter)

    app.use((req, res) => {
        res.send({
            status: 404,
            message: "Invalid URL... !!!"
        });
    });
}

export default initRoutes;