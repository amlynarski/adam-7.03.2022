# orderbook

## Setup
* `yarn install`
* `expo start` 
* press `i` for iPhone simulator

App optimized for iPhone 13 (tested on Simulator)

## Notes from author
* APP created with expo. 
* Scope of OrderBook is huge. There are many things which need to be covered when creating application from scratch. This is too much for simple 1-2 day test.
* App handles the most important things, like: optimization for performance (it is working with full 60FPS without throttling and it doesn't have unnecessary rerenders), components/domain separation, important tests, types, business logic, etc. But there are still some things which IMO should be covered (list below "TODO")


## TODO:
* add skeleton for data
* handle formatting numbers globally in some util function with locales
* color variables should be declared in one separated files (currently all colors are used inside Styles)
* better network handling & messages about connection lost
* throttling based on device performance (currently is set to 200ms look for THROTTLE_TIME)
* calculate MAX_ELEMENTS based on screen height 
* import font family from designs
* add more tests & error handling

## Additional notes
* it was a really nice task - Thank you & Have a great day!

<img width="478" alt="Zrzut ekranu 2022-03-6 o 23 05 49" src="https://user-images.githubusercontent.com/18632066/156946846-168d24b1-dcee-48ba-a0a6-f4bb2efa1619.png">
<img width="478" alt="Zrzut ekranu 2022-03-6 o 23 05 54" src="https://user-images.githubusercontent.com/18632066/156946849-47977de9-cfee-4079-8ce1-691d5515cc54.png">
<img width="478" alt="Zrzut ekranu 2022-03-6 o 23 06 00" src="https://user-images.githubusercontent.com/18632066/156946850-db345be6-ffcd-4659-a052-020b0fc9af0a.png">
