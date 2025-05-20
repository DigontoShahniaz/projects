"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNewDiaryEntry = exports.NewEntrySchema = void 0;
const types_1 = require("./types");
const zod_1 = require("zod");
exports.NewEntrySchema = zod_1.z.object({
    weather: zod_1.z.nativeEnum(types_1.Weather),
    visibility: zod_1.z.nativeEnum(types_1.Visibility),
    date: zod_1.z.string().date(),
    comment: zod_1.z.string().optional()
});
const toNewDiaryEntry = (object) => {
    return exports.NewEntrySchema.parse(object);
};
exports.toNewDiaryEntry = toNewDiaryEntry;
