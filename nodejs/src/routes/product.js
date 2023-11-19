import express from "express";
import { create, get, getAll, getProductsByCategory, remove, update } from "../controllers/product";
import { checkPermission } from "../middlewares/checkPermission";
const router = express.Router();

router.get("/products", getAll);
router.get("/products/:id", get);
router.post("/products", create);
router.put("/products/:id", update);
router.delete("/products/:id", remove);
router.get("/products/category/:categoryId", getProductsByCategory);

export default router;
