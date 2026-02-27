// const { constants } = require("../constants");

// const errorHandler = (err,req,res,next) => {
//     const statusCode = res.statusCode ? res.statusCode : 500;

//     switch (statusCode) {
//         case constants.VALIDATION_ERROR:
//             res.json({title: "Validation Failed", message: err.message, stackTrace: err.stack});
//             break;

//         case constants.NOT_FOUND: 
//             res.json({title: "Not Found", message: err.message, stackTrace: err.stack});
//             break;

//         case constants.UNAUTHORIZED: 
//             res.json({title: "Unauthorized access", message: err.message, stackTrace: err.stack});
//             break;

//         case constants.FORBIDDEN: 
//             res.json({title: "Forbidden", message: err.message, stackTrace: err.stack});
//             break;

//         case constants.SERVER_ERROR: 
//             res.json({title: "Server Error", message: err.message, stackTrace: err.stack});
//             break;

//         default:
//             console.log("You should not be here!");
//             break;
//     }

// };

// module.exports = { errorHandler };
const { constants } = require("../constants");

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode && res.statusCode !== 200 
        ? res.statusCode 
        : 500;

    res.status(statusCode);

    switch (statusCode) {
        case constants.VALIDATION_ERROR:
            res.json({ title: "Validation Failed", message: err.message });
            break;

        case constants.NOT_FOUND:
            res.json({ title: "Not Found", message: err.message });
            break;

        case constants.UNAUTHORIZED:
            res.json({ title: "Unauthorized access", message: err.message });
            break;

        case constants.FORBIDDEN:
            res.json({ title: "Forbidden", message: err.message });
            break;

        case constants.SERVER_ERROR:
        default:
            res.json({ title: "Server Error", message: err.message });
            break;
    }
};

module.exports = { errorHandler };