# OdooApp

Odoo App for conect Odoo server on mobile, Android and iOS. Develop by [Moldeo Interactive](https://www.moldeointeractive.com.ar).

Develop with Angular and Cordova. For Odoo Server with just one DB.

Developer: Ignacio Buioli

## Devices Testing

* Huawei SCL-L03 - Android 5.1.1

## Known Issues

* In certain cases an installation error may occur. It will display the "Odoo server need Odoo App Connector Module" alert. If the "odoo_app_connector" module is installed and configured on the Odoo server, it will be necessary to reinstall the App on the device. Error detected in: 
  * Xiaomi MiMix 2 (Android Pie)
  * Samsung Notes 8

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `npm run build:aot` to build the optimized project on Cordova folder.

## Requirements

It requires [odoo_app_connector](https://github.com/ctmil/odoo_app_connector) module installed and configured on Odoo Online Server.

---

Contact: info@moldeointeractive.com.ar
