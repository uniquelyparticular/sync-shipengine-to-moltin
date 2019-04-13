const { json, send } = require('micro')
const { MemoryStorageFactory } = require('@moltin/sdk')
const moltinGateway = require('@moltin/sdk').gateway
const moltin = moltinGateway({
  client_id: process.env.MOLTIN_CLIENT_ID,
  client_secret: process.env.MOLTIN_CLIENT_SECRET,
  storage: new MemoryStorageFactory(),
  application: 'demo-sync-shipengine-to-moltin'
})
const cors = require('micro-cors')({
  allowMethods: ['POST']
})

const _toJSON = error => {
  return !error
    ? ''
    : Object.getOwnPropertyNames(error).reduce(
        (jsonError, key) => {
          return { ...jsonError, [key]: error[key] }
        },
        { type: 'error' }
      )
}

const _toLowercase = string => {
  return !string ? '' : string.toLocaleLowerCase()
}

process.on('unhandledRejection', (reason, p) => {
  console.error(
    'Promise unhandledRejection: ',
    p,
    ', reason:',
    JSON.stringify(reason)
  )
})

module.exports = cors(async (req, res) => {
  if (req.method === 'OPTIONS') {
    return send(res, 204)
  }

  /*
{
  "resource_url": "https://api.shipengine.com/v1/tracking/usps/9361269903502070406152",
  "resource_type": "API_TRACK",
  "data": {
    "links": {
      "self": {
        "href": "https://api.shipengine.com/v1/tracking/usps/9361269903502070406152"
      },
      "label": null
    },
    "tracking_number": "9361269903502070406152",
    "status_code": "DE",
    "status_description": "Delivered",
    "carrier_status_code": "01",
    "carrier_status_description": "Your item was picked up at the post office...",
    "shipped_date": "2019-04-12T05:00:00.000Z",
    "estimated_delivery_date": null,
    "actual_delivery_date": "2019-04-12T17:45:26.734Z",
    "exception_description": null,
    "events": [
      {
        "event_date": "2019-04-12T17:45:26.734Z",
        "description": "Delivered, Individual Picked Up at Post Office",
        "city_locality": "AUSTIN",
        "state_province": "TX",
        "postal_code": "78721",
        "country_code": "",
        "company_name": "",
        "signer": ""
      }
    ]
  }
}
*/

  try {
    const tracking_update = await json(req)
    const { status_description: status } = tracking_update

    let tracking_extra = {} //TODO: figure out how to get OrderID added to ShipEngine Shipment
    if (tracking_update.extra) {
      tracking_extra = tracking_update.extra
    }
    const { order_id } = tracking_extra
    // let { order_id } = tracking_extra

    // if (!order_id) {
    //   order_id = '730589c9-ee68-44b4-a201-bb38a9468abe'
    // }

    if (order_id) {
      if (_toLowercase(status) === 'delivered') {
        moltin.Orders.Update(order_id, {
          shipping: 'fulfilled'
        })
          .then(order => {
            console.info(order)
            return send(res, 200, JSON.stringify({ received: true, order_id }))
          })
          .catch(error => {
            const jsonError = _toJSON(error)
            return send(
              res,
              jsonError.errors[0].status ? jsonError.errors[0].status : 500,
              jsonError
            )
          })
      } else {
        return send(res, 200, JSON.stringify({ received: true, order_id }))
      }
    } else {
      console.error('missing order_id')
      return send(
        res,
        200,
        JSON.stringify({ received: true, order_id: 'null' })
      )
    }
  } catch (error) {
    const jsonError = _toJSON(error)
    return send(res, 500, jsonError)
  }
})
