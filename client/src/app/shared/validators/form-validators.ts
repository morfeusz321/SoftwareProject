import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";
import {GraphEditorFacade} from "@app/dashboard/core/state/graph-editor-store/graph-editor.facade";
import {take} from "rxjs";


export function jsonValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    try {
      const str = control.value.replace(/>>/g, '"');
      const json = str.replace(/<</g, '"');
      JSON.parse(json);
      return null;
    } catch (e) {
      return { jsonInvalid: true };
    }
  };
}

export function xmlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(control.value,"text/xml");

      // parser returns a document even if the xml is invalid.
      // We need to check if there are parsing errors in the 'parsererror' tag
      if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
        throw new Error('Invalid XML');
      }

      return null;
    } catch (e) {
      return { xmlInvalid: true };
    }
  };
}

export function jsonOrXmlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const jsonInvalid = jsonValidator()(control);
    const xmlInvalid = xmlValidator()(control);

    if (jsonInvalid && xmlInvalid) {
      return { jsonOrXmlInvalid: true };
    }

    return null;
  };
}

export function urlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    try {
      new URL(control.value);
      return null;
    } catch (e) {
      return {urlInvalid: true};
    }
  };
}

export function nodeIdValidator(facade: GraphEditorFacade): ValidatorFn {

  return (control: AbstractControl): ValidationErrors | null => {
    try {
      let nodes;
      facade.nodes$.pipe(take(1)).subscribe((n) => {nodes = n});
      let selected;
      facade.selectedNode$.pipe(take(1)).subscribe((n) => {selected = n});
      const nodeId = control.value;
      if (nodes.find((node) => node.id === nodeId) == null || nodeId === selected.id) {
        return {nodeIdInvalid: true};
      }
      return null;
    } catch (e) {
      return {nodeIdInvalid: true};
    }
  };
}

export function numberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    try{
      const value = control.value;
      if (value === null || value === undefined || value === '') {
        return { notANumber: true }
      }
      const parsedValue = Number(value);
      if (isNaN(parsedValue)) {
        return { notANumber: true }; // Return an error if the field is not a number
      }
      return null; // No error if the field is a number
    } catch {
      return { nodeInvalid: true }
    }
  }
}
