'use strict';

describe('Simple Select', function() {

    var $compile,
        $scope,
        template;

    beforeEach(function () {

        module('simple-select');

        inject(function (_$rootScope_, _$compile_) {
            $scope = _$rootScope_.$new();
            $compile = _$compile_;
        });
    });

    describe('template', function() {

        beforeEach(function() {
            $scope.collection = [
                {name: 'item 1', ticked: false}
            ];
        });

        it('should generate default body', function(){

            // proves that the template should generate correctly

            template = $compile('<div simple-select collection="collection"></div>')($scope);
            $scope.$digest();

            var templateAsHtml = template.html();
            expect(templateAsHtml).toContain('item in collection');
        });

        it('should generate non-template html', function() {

            // proves that the template should generate correctly with the correct list items by default


            template = $compile('<div simple-select collection="collection"></div>')($scope);

            $scope.$digest();

            var templateAsHtml = template.html();
            expect(templateAsHtml).toContain('<span class="ng-binding">item 1</span>');

        });

        it('should generate user-specified html', function() {

            // proves that the template should generate list items correctly when inner html is supplied.

            template = $compile('<div simple-select collection="collection">{{ item.name + \'a\'}}</div>')($scope);

            $scope.$digest();

            var templateAsHtml = template.html();
            expect(templateAsHtml).toContain('<span class="ng-binding">item 1a</span>');

        });

    });

    describe('item ', function() {

        // tests the functionality of each list item generated by the template

        var element, $dScope;

        beforeEach(function() {

            $scope.collection = [
                { name: 'item 1', ticked: false },
                { name: 'item 2', ticked: false }
            ];

            element = angular.element('<div simple-select collection="collection"></div>');

            template = $compile(element)($scope);

            $dScope = element.isolateScope();
            $scope.$apply();

        });

        it('should know there isn\'t a callback', function() {

            // proves that no callback for onItemClick has been provided in the $scope

            expect($dScope.hasOnItemClick()).toBe(false);
        });

        it('should tick item 1 when clicked', function(done) {

            // when the first item is clicked it should be in the ticked state (item.ticked = true).

            var elem = template.find('li').next();

            elem.on('click', function(){
                $scope.$digest();
                expect($dScope.collection[0].ticked).toBe(true);
                expect($dScope.collection[1].ticked).toBe(false);
                done();
            });

            elem.triggerHandler('click');
        });

        it('should tick all items when all are selected', function(done) {

            // when all items are clicked individually the all items should be in the ticked state.

            var elem1 = template.find('li').next();
            var elem2 = template.find('li').next().next();

            elem2.on('click', function() {
                $scope.$digest();
                expect($dScope.collection[0].ticked).toBe(true);
                expect($dScope.collection[1].ticked).toBe(true);
                done();
            });

            elem1.on('click', function(){
                elem2.triggerHandler('click');
            });

            elem1.triggerHandler('click');
        });

    });

    describe('item onItemClick', function() {

        // tests the functionality on the onItemClick delegate when items are clicked

        var element, $dScope;

        beforeEach(function() {

            $scope.collection = [
                { name: 'item 1', ticked: false },
                { name: 'item 2', ticked: false }
            ];

            $scope.itemClicked = function() {
            };

            element = angular.element('<div simple-select collection="collection" on-item-click="itemClicked"></div>');

            template = $compile(element)($scope);

            $dScope = element.isolateScope();

            spyOn($dScope, 'onItemClick');

            $scope.$apply();
        });

        it('should know that there is a callback', function() {

            // proves that the onItemClick has been proveded in the $scope.

            expect($dScope.hasOnItemClick()).toBe(true);
        });

        it('should fire when item is clicked ', function(done) {

            // proves that the onItemClick is fired when an item is clicked

            var elem = template.find('li').next();

            elem.on('click', function(){
                $scope.$digest();
                expect($dScope.collection[0].ticked).toBe(true);
                expect($dScope.collection[1].ticked).toBe(false);
                expect($dScope.onItemClick).toHaveBeenCalled();
                done();
            });

            elem.triggerHandler('click');
        });

    });

    describe('select all', function() {

        // tests the functionality of the select all feature

        var element, $dScope;

        beforeEach(function() {

            $scope.collection = [
                { name: 'item 1', ticked: false },
                { name: 'item 2', ticked: false }
            ];

            element = angular.element('<div simple-select collection="collection"></div>');

            template = $compile(element)($scope);

            $dScope = element.isolateScope();

            spyOn($dScope, 'onItemClick');

            $scope.$apply();

        });

        it('should know there isn\'t a callback', function() {

            // proves that an onTickAll delegate has not been provided

            expect($dScope.hasOnTickAll()).toBe(false);
        });

        it('should tick when all items are ticked', function(done) {

            // when all items are ticked individually this should tick the select all box

            var elem1 = template.find('li').next();
            var elem2 = template.find('li').next().next();

            elem2.on('click', function() {
                $scope.$digest();
                expect($dScope.collection[0].ticked).toBe(true);
                expect($dScope.collection[1].ticked).toBe(true);
                expect($dScope.tickedAll).toBe(true);
                done();
            });

            elem1.on('click', function(){
                elem2.triggerHandler('click');
            });

            expect($dScope.tickedAll).toBe(false);
            elem1.triggerHandler('click');

        });

        it('should tick all items when clicked', function(done){

            // proves that when select all is clicked all

            var elem = template.find('li');

            elem.on('click', function() {

                $scope.$digest();
                expect($dScope.collection[0].ticked).toBe(true);
                expect($dScope.collection[1].ticked).toBe(true);
                expect($dScope.tickedAll).toBe(true);
                done();

            });

            expect($dScope.tickedAll).toBe(false);
            elem.triggerHandler('click');

        });

    });

    describe('select onTickAll', function() {

        var element, $dScope;

        beforeEach(function() {

            $scope.collection = [
                { name: 'item 1', ticked: false },
                { name: 'item 2', ticked: false }
            ];

            $scope.tickedAll = function() {

            };

            element = angular.element('<div simple-select on-tick-all="tickedAll" collection="collection"></div>');

            template = $compile(element)($scope);

            $dScope = element.isolateScope();

            $scope.$apply();

        });

        it('should know that there is a callback ', function() {

            // proves that onTickAll is defined in $scope

            expect($dScope.hasOnTickAll()).toBe(true);

        });

        it('should fire onTickAll when clicked', function(done){

            // proves that the onTickAll delegate is fired when tick all is clicked

            spyOn($dScope, 'onTickAll');

            var elem = template.find('li');

            elem.on('click', function(){
                $scope.$digest();
                expect($dScope.collection[0].ticked).toBe(false);
                expect($dScope.collection[1].ticked).toBe(false);
                expect($dScope.onTickAll).toHaveBeenCalled();
                done();
            });

            elem.triggerHandler('click');

        });

    });



});
