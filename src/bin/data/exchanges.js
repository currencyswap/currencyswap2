/**
 * Created by dqlgnoleth on 30/12/2016.
 */
module.exports = {
    exchanges: [
        {
            createdDate: new Date(Date.now() + 1000),
            fromCode: 'USD',
            toCode: 'NGN',
            buy: 300,
            sell: 400
        },
        {
            createdDate: new Date(Date.now() + 5000),
            fromCode: 'EUR',
            toCode: 'NGN',
            buy: 400,
            sell: 500
        },
        {
            createdDate: new Date(Date.now() + 10000),
            fromCode: 'GBP',
            toCode: 'NGN',
            buy: 500,
            sell: 600
        }
    ]
};