const router = require("express").Router();
const { allUserGET, messageGET, messagePOST, unsendMessagePOST } = require("../controllers/chat");

router.get("/", allUserGET);
router.get("/message", messageGET);
router.post("/message", messagePOST);
router.post("/unsend", unsendMessagePOST);

module.exports = router;
