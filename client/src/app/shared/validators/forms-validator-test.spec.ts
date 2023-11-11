import {
  jsonValidator,
  urlValidator,
  nodeIdValidator,
  jsonOrXmlValidator,
  xmlValidator,
} from '@app/shared/validators/form-validators';
import { INode } from '@app/shared/interfaces/node/node.interface';
import { GraphEditorFacade } from '@app/dashboard/core/state/graph-editor-store/graph-editor.facade';
import { of } from 'rxjs';
import { FormControl } from '@angular/forms';

describe('validatorsTest', () => {
  let facade: GraphEditorFacade;

  it('valid json', () => {
    expect(jsonOrXmlValidator()({ value: '{"test": "test"}' } as any)).toEqual(null);
  });

  it('invalid json', () => {
    expect(jsonValidator()({ value: '{test: "test"}' } as any)).toEqual({ jsonInvalid: true });
  });

  it('valid url', () => {
    expect(urlValidator()({ value: 'https://www.google.com' } as any)).toEqual(null);
  });

  it('invalid url', () => {
    expect(urlValidator()({ value: 'ww.gogle.cm' } as any)).toEqual({ urlInvalid: true });
  });

  it('valid node id', () => {
    facade = {
      nodes$: of([{ id: '1' }, { id: '2' }] as INode[]),
      selectedNode$: of({ id: '1' } as INode),
    } as GraphEditorFacade;
    expect(nodeIdValidator(facade)(new FormControl('2'))).toEqual(null);
  });

  it('invalid node id selected node', () => {
    facade = {
      nodes$: of([{ id: '1' }, { id: '2' }] as INode[]),
      selectedNode$: of({ id: '1' } as INode),
    } as GraphEditorFacade;
    expect(nodeIdValidator(facade)(new FormControl('1'))).toEqual({ nodeIdInvalid: true });
  });

  it('invalid node id node null', () => {
    facade = {
      nodes$: of([{ id: '1' }, { id: '2' }] as INode[]),
      selectedNode$: of({ id: '2' } as INode),
    } as GraphEditorFacade;
    expect(nodeIdValidator(facade)(new FormControl('3'))).toEqual({ nodeIdInvalid: true });
  });

  it('invalid node id try catch', () => {
    facade = {
      nodes$: of([{ id: '1' }, { id: '2' }] as INode[]),
    } as GraphEditorFacade;
    expect(nodeIdValidator(facade)(new FormControl('1'))).toEqual({ nodeIdInvalid: true });
  });

  it('valid xml', () => {
    expect(
      jsonOrXmlValidator()({ value: '' + '<?xml version="1.0" encoding="UTF-8" ?>\n' + '<test>test</test>' } as any)
    ).toEqual(null);
  });

  it('invalid xml', () => {
    expect(xmlValidator()({ value: '<tst>test</test>' } as any)).toEqual({ xmlInvalid: true });
  });

  it('invalid  json and xml', () => {
    expect(jsonOrXmlValidator()({ value: 'invalid' } as any)).toEqual({ jsonOrXmlInvalid: true });
  });
});
