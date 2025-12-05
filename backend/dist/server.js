"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const ingest_1 = __importDefault(require("./routes/ingest"));
const analytics_1 = __importDefault(require("./routes/analytics"));
const scheduler_1 = require("./services/scheduler");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/ingest', ingest_1.default);
app.use('/api/analytics', analytics_1.default);
app.get('/', (req, res) => {
    res.send('Xeno FDE Internship Assignment API');
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    (0, scheduler_1.startScheduler)();
});
