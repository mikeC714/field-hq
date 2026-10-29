import request from "supertest";
import { describe, before, after, beforeEach, afterEach, test } from "node:test";
import assert from "node:assert";
import { build } from "../../app.ts";
import { testDb } from "../../config/postgresql.ts";
import { resend } from "../../config/resend.ts"
import { user } from "../mock/user.ts";
import bcrypt from "bcrypt"; 




