//http://www.cnblogs.com/longhx/p/5514443.html


		var append = function(node, scope) {
		    if(node.nodeType === 1 || node.nodeType === 9 || node.nodeType === 11) {
		        scope.appendChild(node);
		    }
		};
		var prepend = function(node, scope) {
		    if(node.nodeType === 1 || node.nodeType === 9 || node.nodeType === 11) {
		        scope.insertBefore(node, scope.firstChild);
		    }
		};
		var before = function(node, scope) {
		    if(node.nodeType === 1 || node.nodeType === 9 || node.nodeType === 11) {
		        scope.parentNode.insertBefore(node, scope);
		    }
		};
		var after = function(node, scope) {
		    if(node.nodeType === 1 || node.nodeType === 9 || node.nodeType === 11) {
		        scope.parentNode.insertBefore(node, scope.nextSibling);
		    }
		};


		//E5才有的迭代, 所以迭代要预先兼容
		Array.prototype.forEach = [].forEach || function(callback) {
		    for(var i = 0, len = this.length; i < len; i++) {
		        callback.call(this[i], this[i], i, this);
		    }
		};  

		/**插入策略集合**/
		var insertStrategies = {
		    before : function(node, scope) {
		        scope.parentNode.insertBefore(node, scope);
		    },
		    prepend : function(node, scope) {
		        scope.insertBefore(node, scope.firstChild);
		    },
		    append : function(node, scope) {
		        scope.appendChild(node);
		    },
		    after : function(node, scope) {
		        scope.parentNode.insertBefore(node, scope.nextSibling);
		    },
		    
		    /*支持字符串格式的插入, 注意：要兼容不可直接做div子类的元素*/
		    /*insertAdjace还有Element和Text，前者只能插元素，后者只能插文本*/
		    beforestr : function(node, scope) {
		        scope.insertAdjacentHTML('beforeBegin', node);
		    },
		    prependstr : function(node, scope) {
		        scope.insertAdjacentHTML('afterBegin', node);
		    },
		    appendstr : function(node, scope) {
		        scope.insertAdjacentHTML('beforeEnd', node);
		    },
		    afterstr : function(node, scope) {
		        scope.insertAdjacentHTML('afterEnd', node);
		    }
		};

		//响应函数
		var returnMethod = function(method, node, scope) {
		    //如果是字符串
		    if(typeof node === 'string') {
		        return insertStrategies[method + 'str'](node, scope);
		    }
		    //1(元素)、9(文档)、11(文档碎片)
		    if(node.nodeType === 1 || node.nodeType === 9 || node.nodeType === 11) {
		        return insertStrategies[method](node, scope);
		    }
		    //此处还可添加节点集合的处理逻辑，用于处理选择其引擎获取的节点集合。
		};

		['before', 'prepend', 'append', 'after'].forEach(function(method){
		    window[method] = function(node, scope) {
		        returnMethod(method, node, scope);
		    };
		});


		/*兼容IE的applyElement*/
		HTMLElement.prototype.removeNode = HTMLElement.prototype.removeNode || function(deep) {
		    if(this.parentNode) {
		        var range = this.ownerDocument.createRange();
		        range.selectNodeContents(this);
		        if(!deep) {
		            var fragment = range.extractContents();
		            range.setStartBefore(this);
		            range.insertNode(fragment);
		            range.detach();
		        }
		        return this.parentNode.removeChild(this);
		    }
		}; 

		HTMLElement.prototype.applyElement = HTMLElement.prototype.applyElement || function(node, where) {
		    node = node.removeNode();
		    where = (where || 'outside').toLowerCase();
		    var range = this.ownerDocument.createRange();
		    if(where === 'inside') {
		        range.selectNodeContents(this);
		        range.surroundContents(node);
		        range.detach();
		    }else if(where === 'outside') {
		        range.selectNode(this);
		        range.surroundContents(node);
		        range.detach();
		    }
		    return node;
		};


		//E5才有的迭代, 所以迭代要预先兼容
		Array.prototype.forEach = [].forEach || function(callback) {
		    for(var i = 0, len = this.length; i < len; i++) {
		        callback.call(this[i], this[i], i, this);
		    }
		};  

		/**插入策略集合**/
		var insertStrategies = {
		    before : function(node, scope) {
		        scope.parentNode.insertBefore(node, scope);
		    },
		    prepend : function(node, scope) {
		        scope.insertBefore(node, scope.firstChild);
		    },
		    append : function(node, scope) {
		        scope.appendChild(node);
		    },
		    after : function(node, scope) {
		        scope.parentNode.insertBefore(node, scope.nextSibling);
		    },
		    
		    /*支持字符串格式的插入, 注意：要兼容不可直接做div子类的元素*/
		    /*insertAdjace还有Element和Text，前者只能插元素，后者只能插文本*/
		    /**/
		    beforestr : function(node, scope) {
		        scope.insertAdjacentHTML('beforeBegin', node);
		    },
		    prependstr : function(node, scope) {
		        scope.insertAdjacentHTML('afterBegin', node);
		    },
		    appendstr : function(node, scope) {
		        scope.insertAdjacentHTML('beforeEnd', node);
		    },
		    afterstr : function(node, scope) {
		        scope.insertAdjacentHTML('afterEnd', node);
		    }
		};

		//响应函数
		var returnMethod = function(method, node, scope) {
		    //如果是字符串
		    if(typeof node === 'string') {
		        //低版本浏览器使用机会毕竟少数，每次都要判断很划不来。这段代码舍弃
		        /*if(!scope.insertAdjacentHTML){
		            throw new Error('(Firefox8-、IE4-、Opera7-、Safari4-)浏览器不能插入字符串!');
		        }*/
		        return insertStrategies[method + 'str'](node, scope);
		    }
		    //1(元素)、2(属性)、3(文本)、9(文档)、11(文档碎片)
		    if(node.nodeType === 1 || node.nodeType === 9 || node.nodeType === 11) {
		        return insertStrategies[method](node, scope);
		    }
		    //此处还可添加节点集合的处理逻辑(用文档碎片)
		};

		['before', 'prepend', 'append', 'after'].forEach(function(method){
		    HTMLElement.prototype[method] = function(node) {
		        returnMethod(method, node, this);
		    };
		});

		/*兼容IE的applyElement*/
		HTMLElement.prototype.removeNode = HTMLElement.prototype.removeNode || function(deep) {
		    if(this.parentNode) {
		        var range = this.ownerDocument.createRange();
		        range.selectNodeContents(this);
		        if(!deep) {
		            var fragment = range.extractContents();
		            range.setStartBefore(this);
		            range.insertNode(fragment);
		            range.detach();
		        }
		        return this.parentNode.removeChild(this);
		    }
		}; 

		HTMLElement.prototype.applyElement = HTMLElement.prototype.applyElement || function(node, where) {
		    node = node.removeNode();
		    where = (where || 'outside').toLowerCase();
		    var range = this.ownerDocument.createRange();
		    if(where === 'inside') {
		        range.selectNodeContents(this);
		        range.surroundContents(node);
		        range.detach();
		    }else if(where === 'outside') {
		        range.selectNode(this);
		        range.surroundContents(node);
		        range.detach();
		    }
		    return node;
		};
