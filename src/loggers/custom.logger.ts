import { LoggerService } from '@nestjs/common';
import fs = require('fs');
import moment, { Moment } from 'moment';

export class CustomLogger implements LoggerService {

  private _logFile: fs.WriteStream;
  private _errorFile: fs.WriteStream;
  private _warnFile: fs.WriteStream;
  private _debugFile: fs.WriteStream;
  private _verboseFile: fs.WriteStream;
  private _dateInstance: Moment;
  
  constructor () {
    this._dateInstance = moment();
    try {
      console.log(`[ 'AppInfo' ] Creating logs directory...`);
      fs.mkdirSync('./logs');
    } catch (e) {
      if (e.code === 'EEXIST') {
        console.warn(`[ 'AppWarning' ] Logs directory already exists!`);
      }
      console.warn(`[ 'AppWarning' ] Could not create logs directory, skipping...`);
    }
    this._logFile = fs.createWriteStream('./logs/general.log', {flags:'a+'});
    this._errorFile = fs.createWriteStream('./logs/error.log', {flags:'a+'});
    this._warnFile = fs.createWriteStream('./logs/warn.log', {flags:'a+'});
    this._debugFile = fs.createWriteStream('./logs/debug.log', {flags:'a+'});
    this._verboseFile = fs.createWriteStream('./logs/verbose.log', {flags:'a+'});
  }
  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]) {
    console.log(optionalParams, message);
    
    this._logFile.write('[' + this._dateInstance.toISOString() + ']: ' +  message + '\n');
  }

  /**
   * Write an 'error' level log.
   */
  error(message: any, ...optionalParams: any[]) {
    console.error(message, optionalParams);
    this._errorFile.write('[' + this._dateInstance.toISOString() + ']: ' +  message + '\n');
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, ...optionalParams: any[]) {
    console.warn(message, optionalParams);
    this._warnFile.write('[' + this._dateInstance.toISOString() + ']: ' +  message + '\n');
  }

  /**
   * Write a 'debug' level log.
   */
  debug?(message: any, ...optionalParams: any[]) {
    console.debug(message, optionalParams);
    this._debugFile.write('[' + this._dateInstance.toISOString() + ']: ' +  message + '\n');
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose?(message: any, ...optionalParams: any[]) {
    console.info(message, optionalParams);
    this._verboseFile.write('[' + this._dateInstance.toISOString() + ']: ' +  message + '\n');
  }
}